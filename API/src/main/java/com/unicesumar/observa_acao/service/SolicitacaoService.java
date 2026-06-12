package com.unicesumar.observa_acao.service;

import com.unicesumar.observa_acao.dto.endereco.EnderecoSolicitacaoRequestDTO;
import com.unicesumar.observa_acao.dto.historico.HistoricoResponseDTO;
import com.unicesumar.observa_acao.dto.imagem.ImagemSolicitacaoResponseDTO;
import com.unicesumar.observa_acao.dto.solicitacao.*;
import com.unicesumar.observa_acao.enums.StatusSolicitacao;
import com.unicesumar.observa_acao.enums.TipoLog;
import com.unicesumar.observa_acao.enums.TipoUsuario;
import com.unicesumar.observa_acao.exception.AcessoNegadoException;
import com.unicesumar.observa_acao.exception.NotFoundException;
import com.unicesumar.observa_acao.exception.RegraDeNegocioException;
import com.unicesumar.observa_acao.mapper.EnderecoSolicitacaoMapper;
import com.unicesumar.observa_acao.model.*;
import com.unicesumar.observa_acao.repository.*;
import com.unicesumar.observa_acao.util.FotoUrlHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SolicitacaoService {

    private final SolicitacaoRepository solicitacaoRepository;
    private final EnderecoSolicitacaoRepository enderecoSolicitacaoRepository;
    private final ImagemSolicitacaoRepository imagemRepository;
    private final HistoricoSolicitacaoRepository historicoRepository;
    private final CategoriaRepository categoriaRepository;
    private final UsuarioRepository usuarioRepository;
    private final EnderecoUsuarioRepository enderecoUsuarioRepository;
    private final EnderecoSolicitacaoMapper enderecoMapper;
    private final LogService logService;
    private final PasswordEncoder passwordEncoder;
    private final FotoUrlHelper fotoUrlHelper;

    @Value("${app.base-url}")
    private String baseUrl;

    private static final Set<String> TIPOS_IMAGEM_ACEITOS = Set.of("image/jpeg", "image/png", "image/webp");
    private static final int LIMITE_IMAGENS = 5;

    @Transactional
    public SolicitacaoResponseDTO criar(SolicitacaoRequestDTO dto, List<MultipartFile> imagens) {
        Usuario solicitante = getUsuarioLogado();

        Categoria categoria = categoriaRepository.findById(dto.categoriaId())
                .orElseThrow(() -> new NotFoundException("Categoria não encontrada"));

        List<MultipartFile> imagensValidas = filtrarNaoVazios(imagens);

        if (imagensValidas.size() > LIMITE_IMAGENS) {
            throw new RegraDeNegocioException("Limite de 5 imagens por solicitação atingido.");
        }
        for (MultipartFile arquivo : imagensValidas) {
            validarArquivo(arquivo);
        }

        EnderecoSolicitacaoRequestDTO endDTO = resolverEndereco(dto, solicitante);

        Solicitacao sol = new Solicitacao();
        sol.setTitulo(dto.titulo().trim());
        sol.setDescricao(dto.descricao().trim());
        sol.setAnonima(dto.anonima());
        sol.setStatus(StatusSolicitacao.AGUARDANDO_APROVACAO);
        sol.setCategoria(categoria);
        sol.setDataAbertura(dto.dataAbertura());
        sol.setSolicitante(solicitante);

        Solicitacao salva = solicitacaoRepository.save(sol);

        EnderecoSolicitacao endereco = criarEndereco(endDTO, salva);
        salva.setEnderecoSolicitacao(endereco);

        for (MultipartFile arquivo : imagensValidas) {
            salvarArquivoImagem(arquivo, salva);
        }

        registrarHistorico(salva, null, StatusSolicitacao.AGUARDANDO_APROVACAO, null, solicitante);

        logService.registrar(TipoLog.CRIACAO,
                "Solicitação criada: ID " + salva.getId() + " — " + salva.getTitulo(), solicitante);

        return toResponseDTO(salva, solicitante.getTipoUsuario(), solicitante.getId());
    }

    @Transactional
    public SolicitacaoResponseDTO atualizar(Long id, SolicitacaoUpdateDTO dto) {
        Usuario logado = getUsuarioLogado();
        Solicitacao sol = encontrarPorId(id);

        if (!sol.getSolicitante().getId().equals(logado.getId())) {
            throw new AcessoNegadoException("Você não tem permissão para editar esta solicitação");
        }
        if (sol.getStatus() != StatusSolicitacao.AGUARDANDO_APROVACAO) {
            throw new RegraDeNegocioException(
                    "A solicitação não pode mais ser editada após ser enviada para análise.");
        }

        if (dto.titulo() != null && !dto.titulo().isBlank()) sol.setTitulo(dto.titulo().trim());
        if (dto.descricao() != null && !dto.descricao().isBlank()) sol.setDescricao(dto.descricao().trim());
        if (dto.categoriaId() != null) {
            Categoria cat = categoriaRepository.findById(dto.categoriaId())
                    .orElseThrow(() -> new NotFoundException("Categoria não encontrada"));
            sol.setCategoria(cat);
        }
        if (dto.enderecoSolicitacao() != null) {
            atualizarEndereco(sol.getEnderecoSolicitacao(), dto.enderecoSolicitacao());
        }

        logService.registrar(TipoLog.ALTERACAO,
                "Solicitação editada pelo solicitante: ID " + sol.getId(), logado);

        return toResponseDTO(sol, logado.getTipoUsuario(), logado.getId());
    }

    @Transactional(readOnly = true)
    public Page<SolicitacaoResponseDTO> minhas(Pageable pageable) {
        Usuario logado = getUsuarioLogado();
        return solicitacaoRepository.findBySolicitanteId(logado.getId(), pageable)
                .map(s -> toResponseDTO(s, logado.getTipoUsuario(), logado.getId()));
    }

    @Transactional(readOnly = true)
    public SolicitacaoResponseDTO buscarPorId(Long id) {
        Usuario logado = getUsuarioLogado();
        return toResponseDTO(encontrarPorId(id), logado.getTipoUsuario(), logado.getId());
    }

    @Transactional
    public SolicitacaoResponseDTO aprovar(Long id, GestorAprovarDTO dto) {
        Usuario logado = getUsuarioLogado();
        Solicitacao sol = encontrarPorId(id);

        if (sol.getStatus() != StatusSolicitacao.AGUARDANDO_APROVACAO) {
            throw new RegraDeNegocioException("Somente solicitações aguardando aprovação podem ser aprovadas.");
        }

        StatusSolicitacao anterior = sol.getStatus();

        sol.setStatus(StatusSolicitacao.APROVADA);
        registrarHistorico(sol, anterior, StatusSolicitacao.APROVADA, null, logado);

        sol.setStatus(StatusSolicitacao.AGUARDANDO_ATENDENTE);
        sol.setPrioridade(dto.prioridade());
        sol.setDataPrazo(dto.dataPrazo());
        registrarHistorico(sol, StatusSolicitacao.APROVADA, StatusSolicitacao.AGUARDANDO_ATENDENTE, null, logado);

        logService.registrar(TipoLog.ALTERACAO,
                "Solicitação ID " + sol.getId() + " aprovada pelo gestor", logado);

        return toResponseDTO(sol, logado.getTipoUsuario(), logado.getId());
    }

    @Transactional
    public SolicitacaoResponseDTO rejeitar(Long id, GestorRejeitarDTO dto) {
        Usuario logado = getUsuarioLogado();
        Solicitacao sol = encontrarPorId(id);

        if (sol.getStatus() != StatusSolicitacao.AGUARDANDO_APROVACAO) {
            throw new RegraDeNegocioException("Somente solicitações aguardando aprovação podem ser rejeitadas.");
        }

        StatusSolicitacao anterior = sol.getStatus();
        sol.setStatus(StatusSolicitacao.REJEITADA);
        registrarHistorico(sol, anterior, StatusSolicitacao.REJEITADA, dto.observacao(), logado);

        logService.registrar(TipoLog.ALTERACAO,
                "Solicitação ID " + sol.getId() + " rejeitada pelo gestor", logado);

        return toResponseDTO(sol, logado.getTipoUsuario(), logado.getId());
    }

    @Transactional
    public SolicitacaoResponseDTO reativar(Long id) {
        Usuario logado = getUsuarioLogado();
        Solicitacao sol = encontrarPorId(id);

        if (sol.getStatus() != StatusSolicitacao.REJEITADA) {
            throw new RegraDeNegocioException("Apenas solicitações rejeitadas podem ser reativadas.");
        }

        StatusSolicitacao anterior = sol.getStatus();
        sol.setStatus(StatusSolicitacao.AGUARDANDO_APROVACAO);
        registrarHistorico(sol, anterior, StatusSolicitacao.AGUARDANDO_APROVACAO,
                "Reativada pelo gestor para nova análise", logado);

        logService.registrar(TipoLog.ALTERACAO,
                "Solicitação ID " + sol.getId() + " reativada para AGUARDANDO_APROVACAO pelo gestor", logado);

        return toResponseDTO(sol, logado.getTipoUsuario(), logado.getId());
    }

    @Transactional(readOnly = true)
    public Page<SolicitacaoResponseDTO> aguardandoAprovacao(Pageable pageable) {
        Usuario logado = getUsuarioLogado();
        return solicitacaoRepository.findByStatus(StatusSolicitacao.AGUARDANDO_APROVACAO, pageable)
                .map(s -> toResponseDTO(s, logado.getTipoUsuario(), logado.getId()));
    }

    @Transactional(readOnly = true)
    public Page<SolicitacaoResponseDTO> rejeitadas(Pageable pageable) {
        Usuario logado = getUsuarioLogado();
        return solicitacaoRepository.findByStatus(StatusSolicitacao.REJEITADA, pageable)
                .map(s -> toResponseDTO(s, logado.getTipoUsuario(), logado.getId()));
    }

    @Transactional(readOnly = true)
    public Page<SolicitacaoResponseDTO> finalizadas(Pageable pageable) {
        Usuario logado = getUsuarioLogado();
        return solicitacaoRepository.findByStatus(StatusSolicitacao.FINALIZADA, pageable)
                .map(s -> toResponseDTO(s, logado.getTipoUsuario(), logado.getId()));
    }

    @Transactional(readOnly = true)
    public Page<SolicitacaoResponseDTO> emAndamento(Pageable pageable) {
        Usuario logado = getUsuarioLogado();
        if (logado.getTipoUsuario() == TipoUsuario.ATENDENTE) {
            return solicitacaoRepository
                    .findByAtendenteIdAndStatus(logado.getId(), StatusSolicitacao.EM_ANDAMENTO, pageable)
                    .map(s -> toResponseDTO(s, logado.getTipoUsuario(), logado.getId()));
        }
        return solicitacaoRepository.findByStatus(StatusSolicitacao.EM_ANDAMENTO, pageable)
                .map(s -> toResponseDTO(s, logado.getTipoUsuario(), logado.getId()));
    }

    @Transactional
    public SolicitacaoResponseDTO pegar(Long id) {
        Usuario logado = getUsuarioLogado();
        Solicitacao sol = encontrarPorId(id);

        if (sol.getStatus() != StatusSolicitacao.AGUARDANDO_ATENDENTE) {
            throw new RegraDeNegocioException("Apenas solicitações aguardando atendente podem ser pegas.");
        }

        StatusSolicitacao anterior = sol.getStatus();
        sol.setAtendente(logado);
        sol.setStatus(StatusSolicitacao.EM_ANDAMENTO);
        registrarHistorico(sol, anterior, StatusSolicitacao.EM_ANDAMENTO, null, logado);

        logService.registrar(TipoLog.ALTERACAO,
                "Atendente ID " + logado.getId() + " pegou a solicitação ID " + sol.getId(), logado);

        return toResponseDTO(sol, logado.getTipoUsuario(), logado.getId());
    }

    @Transactional
    public SolicitacaoResponseDTO finalizar(Long id) {
        Usuario logado = getUsuarioLogado();
        Solicitacao sol = encontrarPorId(id);

        validarAtendenteDaSolicitacao(sol, logado);
        if (sol.getStatus() != StatusSolicitacao.EM_ANDAMENTO) {
            throw new RegraDeNegocioException("Apenas solicitações em andamento podem ser finalizadas.");
        }

        StatusSolicitacao anterior = sol.getStatus();
        sol.setStatus(StatusSolicitacao.FINALIZADA);
        sol.setDataFinalizacao(LocalDateTime.now());
        registrarHistorico(sol, anterior, StatusSolicitacao.FINALIZADA, null, logado);

        logService.registrar(TipoLog.ALTERACAO,
                "Solicitação ID " + sol.getId() + " finalizada pelo atendente ID " + logado.getId(), logado);

        return toResponseDTO(sol, logado.getTipoUsuario(), logado.getId());
    }

    @Transactional
    public SolicitacaoResponseDTO desvincular(Long id) {
        Usuario logado = getUsuarioLogado();
        Solicitacao sol = encontrarPorId(id);

        validarAtendenteDaSolicitacao(sol, logado);
        if (sol.getStatus() != StatusSolicitacao.EM_ANDAMENTO) {
            throw new RegraDeNegocioException("Apenas solicitações em andamento permitem desvinculação.");
        }

        StatusSolicitacao anterior = sol.getStatus();
        sol.setAtendente(null);
        sol.setStatus(StatusSolicitacao.AGUARDANDO_ATENDENTE);
        registrarHistorico(sol, anterior, StatusSolicitacao.AGUARDANDO_ATENDENTE, null, logado);

        logService.registrar(TipoLog.ALTERACAO,
                "Atendente ID " + logado.getId() + " desvinculou da solicitação ID " + sol.getId(), logado);

        return toResponseDTO(sol, logado.getTipoUsuario(), logado.getId());
    }

    @Transactional
    public SolicitacaoResponseDTO reabrir(Long id) {
        Usuario logado = getUsuarioLogado();
        Solicitacao sol = encontrarPorId(id);

        validarAtendenteDaSolicitacao(sol, logado);
        if (sol.getStatus() != StatusSolicitacao.FINALIZADA) {
            throw new RegraDeNegocioException("Apenas solicitações finalizadas podem ser reabertas.");
        }

        StatusSolicitacao anterior = sol.getStatus();
        sol.setStatus(StatusSolicitacao.EM_ANDAMENTO);
        sol.setDataFinalizacao(null);
        registrarHistorico(sol, anterior, StatusSolicitacao.EM_ANDAMENTO, null, logado);

        logService.registrar(TipoLog.ALTERACAO,
                "Solicitação ID " + sol.getId() + " reaberta pelo atendente ID " + logado.getId(), logado);

        return toResponseDTO(sol, logado.getTipoUsuario(), logado.getId());
    }

    @Transactional(readOnly = true)
    public Page<SolicitacaoResponseDTO> fila(Pageable pageable) {
        Usuario logado = getUsuarioLogado();
        return solicitacaoRepository.findByStatus(StatusSolicitacao.AGUARDANDO_ATENDENTE, pageable)
                .map(s -> toResponseDTO(s, logado.getTipoUsuario(), logado.getId()));
    }

    @Transactional(readOnly = true)
    public Page<SolicitacaoResponseDTO> finalizadasPorMim(Pageable pageable) {
        Usuario logado = getUsuarioLogado();
        return solicitacaoRepository
                .findByAtendenteIdAndStatus(logado.getId(), StatusSolicitacao.FINALIZADA, pageable)
                .map(s -> toResponseDTO(s, logado.getTipoUsuario(), logado.getId()));
    }

    @Transactional(readOnly = true)
    public Page<SolicitacaoResponseDTO> listarTodas(Pageable pageable) {
        return solicitacaoRepository.findAll(pageable)
                .map(s -> toResponseDTO(s, TipoUsuario.ADMINISTRADOR, null));
    }

    @Transactional
    public SolicitacaoResponseDTO revelarAnonimato(Long id, RevealAnonimatoDTO dto) {
        Usuario logado = getUsuarioLogado();

        if (!passwordEncoder.matches(dto.senhaAdm(), logado.getSenha())) {
            throw new AcessoNegadoException("Senha incorreta");
        }

        Solicitacao sol = encontrarPorId(id);

        if (!sol.getAnonima()) {
            throw new RegraDeNegocioException("Esta solicitação não é anônima.");
        }

        sol.setAnonima(false);
        logService.registrar(TipoLog.ALTERACAO,
                "ADM " + logado.getEmail() + " revelou anonimato da solicitação ID " + sol.getId()
                        + ". Observação: " + dto.observacao(), logado);

        return toResponseDTO(sol, TipoUsuario.ADMINISTRADOR, logado.getId());
    }

    @Transactional
    public SolicitacaoResponseDTO vincularAtendente(Long id, VincularAtendenteDTO dto) {
        Usuario logado = getUsuarioLogado();
        Solicitacao sol = encontrarPorId(id);

        Usuario atendente = usuarioRepository.findById(dto.atendenteId())
                .orElseThrow(() -> new NotFoundException("Atendente não encontrado"));

        if (atendente.getTipoUsuario() != TipoUsuario.ATENDENTE) {
            throw new RegraDeNegocioException("O usuário selecionado não é um atendente.");
        }

        sol.setAtendente(atendente);
        logService.registrar(TipoLog.ALTERACAO,
                "ADM vinculou atendente ID " + atendente.getId() + " à solicitação ID " + sol.getId(), logado);

        return toResponseDTO(sol, TipoUsuario.ADMINISTRADOR, logado.getId());
    }

    @Transactional
    public SolicitacaoResponseDTO admUpdate(Long id, SolicitacaoAdmUpdateDTO dto) {
        Usuario logado = getUsuarioLogado();
        Solicitacao sol = encontrarPorId(id);

        if (dto.titulo() != null && !dto.titulo().isBlank()) sol.setTitulo(dto.titulo().trim());
        if (dto.descricao() != null && !dto.descricao().isBlank()) sol.setDescricao(dto.descricao().trim());
        if (dto.categoriaId() != null) {
            Categoria cat = categoriaRepository.findById(dto.categoriaId())
                    .orElseThrow(() -> new NotFoundException("Categoria não encontrada"));
            sol.setCategoria(cat);
        }
        if (dto.prioridade() != null) sol.setPrioridade(dto.prioridade());
        if (dto.dataPrazo() != null) sol.setDataPrazo(dto.dataPrazo());
        if (dto.dataFinalizacao() != null) sol.setDataFinalizacao(dto.dataFinalizacao());
        if (dto.status() != null) {
            StatusSolicitacao anterior = sol.getStatus();
            sol.setStatus(dto.status());
            registrarHistorico(sol, anterior, dto.status(), "Atualização direta pelo administrador", logado);
        }
        if (dto.enderecoSolicitacao() != null) {
            atualizarEndereco(sol.getEnderecoSolicitacao(), dto.enderecoSolicitacao());
        }

        logService.registrar(TipoLog.ALTERACAO,
                "ADM atualizou a solicitação ID " + sol.getId(), logado);

        return toResponseDTO(sol, TipoUsuario.ADMINISTRADOR, logado.getId());
    }

    @Transactional
    public List<ImagemSolicitacaoResponseDTO> adicionarImagens(Long solicitacaoId, List<MultipartFile> arquivos) {
        Usuario logado = getUsuarioLogado();
        Solicitacao sol = encontrarPorId(solicitacaoId);

        boolean isAdm = logado.getTipoUsuario() == TipoUsuario.ADMINISTRADOR;
        if (!isAdm) {
            if (!sol.getSolicitante().getId().equals(logado.getId())) {
                throw new AcessoNegadoException("Você não tem permissão para adicionar imagens a esta solicitação");
            }
            if (sol.getStatus() != StatusSolicitacao.AGUARDANDO_APROVACAO) {
                throw new RegraDeNegocioException(
                        "Imagens só podem ser adicionadas enquanto a solicitação estiver aguardando aprovação.");
            }
        }

        List<MultipartFile> validos = filtrarNaoVazios(arquivos);

        long existentes = imagemRepository.countBySolicitacaoId(solicitacaoId);
        if (existentes + validos.size() > LIMITE_IMAGENS) {
            throw new RegraDeNegocioException("Limite de 5 imagens por solicitação atingido.");
        }

        for (MultipartFile arquivo : validos) {
            validarArquivo(arquivo);
        }

        List<ImagemSolicitacaoResponseDTO> resultado = new ArrayList<>();
        for (MultipartFile arquivo : validos) {
            ImagemSolicitacao imagem = salvarArquivoImagem(arquivo, sol);
            resultado.add(new ImagemSolicitacaoResponseDTO(
                    imagem.getId(),
                    fotoUrlHelper.buildFotoUrl(imagem.getUrl()),
                    imagem.getDataUpload()
            ));
        }

        logService.registrar(TipoLog.ALTERACAO,
                "Imagens adicionadas à solicitação ID " + solicitacaoId, logado);

        return resultado;
    }

    @Transactional
    public void removerImagem(Long solicitacaoId, Long imagemId) {
        Usuario logado = getUsuarioLogado();
        Solicitacao sol = encontrarPorId(solicitacaoId);

        boolean isAdm = logado.getTipoUsuario() == TipoUsuario.ADMINISTRADOR;
        if (!isAdm) {
            if (!sol.getSolicitante().getId().equals(logado.getId())) {
                throw new AcessoNegadoException("Você não tem permissão para remover imagens desta solicitação");
            }
            if (sol.getStatus() != StatusSolicitacao.AGUARDANDO_APROVACAO) {
                throw new RegraDeNegocioException(
                        "Imagens só podem ser removidas enquanto a solicitação estiver aguardando aprovação.");
            }
        }

        ImagemSolicitacao imagem = imagemRepository.findByIdAndSolicitacaoId(imagemId, solicitacaoId)
                .orElseThrow(() -> new NotFoundException("Imagem não encontrada nesta solicitação"));

        imagemRepository.delete(imagem);

        logService.registrar(TipoLog.EXCLUSAO,
                "Imagem ID " + imagemId + " removida da solicitação ID " + solicitacaoId, logado);
    }

    private Usuario getUsuarioLogado() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Usuário autenticado não encontrado"));
    }

    private Solicitacao encontrarPorId(Long id) {
        return solicitacaoRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Solicitação não encontrada"));
    }

    private EnderecoSolicitacaoRequestDTO resolverEndereco(SolicitacaoRequestDTO dto, Usuario solicitante) {
        if (dto.usarEnderecoUsuario()) {
            EnderecoUsuario eu = enderecoUsuarioRepository.findByUsuarioId(solicitante.getId())
                    .orElseThrow(() -> new RegraDeNegocioException(
                            "Você não possui endereço cadastrado. Informe o endereço da solicitação."));
            return new EnderecoSolicitacaoRequestDTO(
                    eu.getCep(), eu.getLogradouro(), eu.getNumero(),
                    eu.getComplemento(), eu.getBairro(), eu.getCidade(), eu.getEstado()
            );
        }
        if (dto.enderecoSolicitacao() == null) {
            throw new RegraDeNegocioException("Endereço é obrigatório quando não utilizar endereço do cadastro.");
        }
        return dto.enderecoSolicitacao();
    }

    private EnderecoSolicitacao criarEndereco(EnderecoSolicitacaoRequestDTO dto, Solicitacao sol) {
        EnderecoSolicitacao endereco = enderecoMapper.toEntity(dto);
        aplicarNormalizacaoEndereco(endereco, dto);
        endereco.setSolicitacao(sol);
        return enderecoSolicitacaoRepository.save(endereco);
    }

    private void atualizarEndereco(EnderecoSolicitacao endereco, EnderecoSolicitacaoRequestDTO dto) {
        endereco.setCep(dto.cep().replaceAll("\\D", ""));
        endereco.setLogradouro(dto.logradouro().trim());
        endereco.setNumero(dto.numero().trim());
        endereco.setComplemento(dto.complemento() != null ? dto.complemento().trim() : null);
        endereco.setBairro(dto.bairro().trim());
        endereco.setCidade(dto.cidade().trim());
        endereco.setEstado(dto.estado().toUpperCase().trim());
    }

    private void aplicarNormalizacaoEndereco(EnderecoSolicitacao e, EnderecoSolicitacaoRequestDTO dto) {
        e.setCep(dto.cep().replaceAll("\\D", ""));
        e.setEstado(dto.estado().toUpperCase().trim());
        if (dto.logradouro() != null) e.setLogradouro(dto.logradouro().trim());
        if (dto.numero() != null) e.setNumero(dto.numero().trim());
        if (dto.bairro() != null) e.setBairro(dto.bairro().trim());
        if (dto.cidade() != null) e.setCidade(dto.cidade().trim());
    }

    private void registrarHistorico(Solicitacao sol, StatusSolicitacao anterior,
                                    StatusSolicitacao novo, String observacao, Usuario responsavel) {
        HistoricoSolicitacao h = new HistoricoSolicitacao();
        h.setSolicitacao(sol);
        h.setStatusAnterior(anterior);
        h.setStatusNovo(novo);
        h.setObservacao(observacao);
        h.setResponsavel(responsavel);
        h.setDataAlteracao(LocalDateTime.now());
        historicoRepository.save(h);
    }

    private void validarAtendenteDaSolicitacao(Solicitacao sol, Usuario logado) {
        if (sol.getAtendente() == null || !sol.getAtendente().getId().equals(logado.getId())) {
            throw new AcessoNegadoException("Você não é o atendente responsável por esta solicitação.");
        }
    }

    private SolicitacaoResponseDTO toResponseDTO(Solicitacao sol, TipoUsuario perfilLogado, Long logadoId) {
        Long solicitanteId = null;
        String solicitanteNome = null;

        if (sol.getSolicitante() != null) {
            boolean isAdm = perfilLogado == TipoUsuario.ADMINISTRADOR;
            boolean isProprioSolicitante = logadoId != null && sol.getSolicitante().getId().equals(logadoId);

            if (!sol.getAnonima() || isAdm) {
                solicitanteId = sol.getSolicitante().getId();
                solicitanteNome = sol.getSolicitante().getNome();
            } else if (isProprioSolicitante) {
                solicitanteId = sol.getSolicitante().getId();
                solicitanteNome = "Anônimo";
            } else {
                solicitanteNome = "Anônimo";
            }
        }

        List<ImagemSolicitacaoResponseDTO> imagens = sol.getImagens().stream()
                .map(img -> new ImagemSolicitacaoResponseDTO(
                        img.getId(),
                        fotoUrlHelper.buildFotoUrl(img.getUrl()),
                        img.getDataUpload()
                ))
                .toList();

        List<HistoricoResponseDTO> historicos = sol.getHistoricos().stream()
                .map(h -> new HistoricoResponseDTO(
                        h.getId(),
                        h.getStatusAnterior(),
                        h.getStatusNovo(),
                        h.getObservacao(),
                        h.getResponsavel() != null ? h.getResponsavel().getId() : null,
                        h.getResponsavel() != null ? h.getResponsavel().getNome() : null,
                        h.getDataAlteracao()
                ))
                .toList();

        return new SolicitacaoResponseDTO(
                sol.getId(),
                sol.getTitulo(),
                sol.getDescricao(),
                sol.getStatus(),
                sol.getPrioridade(),
                sol.getAnonima(),
                sol.getDataAbertura(),
                sol.getDataPrazo(),
                sol.getDataFinalizacao(),
                sol.getCategoria().getId(),
                sol.getCategoria().getNome(),
                enderecoMapper.toResponseDTO(sol.getEnderecoSolicitacao()),
                imagens,
                historicos,
                solicitanteId,
                solicitanteNome,
                sol.getAtendente() != null ? sol.getAtendente().getId() : null,
                sol.getAtendente() != null ? sol.getAtendente().getNome() : null
        );
    }

    private void validarArquivo(MultipartFile arquivo) {
        String contentType = arquivo.getContentType();
        if (contentType == null || !TIPOS_IMAGEM_ACEITOS.contains(contentType)) {
            throw new RegraDeNegocioException("Tipo de arquivo não permitido. Use JPEG, PNG ou WebP.");
        }
        if (arquivo.getSize() > 5L * 1024 * 1024) {
            throw new RegraDeNegocioException("Tamanho máximo por imagem é de 5MB.");
        }
    }

    private ImagemSolicitacao salvarArquivoImagem(MultipartFile arquivo, Solicitacao sol) {
        String contentType = arquivo.getContentType();
        String ext = obterExtensao(arquivo.getOriginalFilename(), contentType);
        String filename = sol.getId() + "_" + System.currentTimeMillis() + "_" + UUID.randomUUID() + ext;

        try {
            Path dir = Paths.get("uploads", "solicitacoes", sol.getId().toString());
            Files.createDirectories(dir);
            Files.copy(arquivo.getInputStream(), dir.resolve(filename));
        } catch (IOException e) {
            throw new RegraDeNegocioException("Erro ao salvar imagem");
        }

        ImagemSolicitacao imagem = new ImagemSolicitacao();
        imagem.setSolicitacao(sol);
        imagem.setUrl("uploads/solicitacoes/" + sol.getId() + "/" + filename);
        imagem.setDataUpload(LocalDateTime.now());
        ImagemSolicitacao salva = imagemRepository.save(imagem);
        sol.getImagens().add(salva);
        return salva;
    }

    private List<MultipartFile> filtrarNaoVazios(List<MultipartFile> arquivos) {
        if (arquivos == null) return List.of();
        return arquivos.stream().filter(f -> f != null && !f.isEmpty()).toList();
    }

    private String obterExtensao(String nomeOriginal, String contentType) {
        if (nomeOriginal != null && nomeOriginal.contains(".")) {
            return nomeOriginal.substring(nomeOriginal.lastIndexOf('.'));
        }
        return switch (contentType) {
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            default -> ".jpg";
        };
    }
}
