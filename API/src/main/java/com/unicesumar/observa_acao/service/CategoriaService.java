package com.unicesumar.observa_acao.service;

import com.unicesumar.observa_acao.dto.categoria.CategoriaRequestDTO;
import com.unicesumar.observa_acao.dto.categoria.CategoriaResponseDTO;
import com.unicesumar.observa_acao.enums.StatusSolicitacao;
import com.unicesumar.observa_acao.enums.TipoLog;
import com.unicesumar.observa_acao.exception.NotFoundException;
import com.unicesumar.observa_acao.exception.RegraDeNegocioException;
import com.unicesumar.observa_acao.mapper.CategoriaMapper;
import com.unicesumar.observa_acao.model.Categoria;
import com.unicesumar.observa_acao.model.Usuario;
import com.unicesumar.observa_acao.repository.CategoriaRepository;
import com.unicesumar.observa_acao.repository.SolicitacaoRepository;
import com.unicesumar.observa_acao.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoriaService {

    private final CategoriaRepository repository;
    private final CategoriaMapper mapper;
    private final LogService logService;
    private final UsuarioRepository usuarioRepository;
    private final SolicitacaoRepository solicitacaoRepository;

    private Usuario getUsuarioLogado() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Usuário autenticado não encontrado"));
    }

    @Transactional
    public CategoriaResponseDTO criar(CategoriaRequestDTO dto) {
        Usuario adm = getUsuarioLogado();
        String nome = dto.nome().trim();

        if (repository.existsByNomeIgnoreCase(nome)) {
            throw new RegraDeNegocioException("Já existe uma categoria com este nome.");
        }

        Categoria categoria = mapper.toEntity(dto);
        categoria.setAtivo(true);
        categoria.setDataCriacao(LocalDateTime.now());
        categoria.setCriadoPor(adm);

        Categoria salva = repository.save(categoria);
        logService.registrar(TipoLog.CRIACAO,
                "Categoria '" + salva.getNome() + "' criada pelo ADM " + adm.getId(), adm);

        return mapper.toResponseDTO(salva);
    }

    @Transactional
    public CategoriaResponseDTO atualizar(Long id, CategoriaRequestDTO dto) {
        Usuario adm = getUsuarioLogado();
        Categoria categoria = buscarEntidadePorId(id);
        String nome = dto.nome().trim();

        if (!nome.equalsIgnoreCase(categoria.getNome()) && repository.existsByNomeIgnoreCaseAndIdNot(nome, id)) {
            throw new RegraDeNegocioException("Já existe uma categoria com este nome.");
        }

        categoria.setNome(nome);
        categoria.setDescricao(dto.descricao().trim());

        logService.registrar(TipoLog.ALTERACAO,
                "Categoria '" + categoria.getNome() + "' atualizada pelo ADM " + adm.getId(), adm);

        return mapper.toResponseDTO(categoria);
    }

    @Transactional
    public CategoriaResponseDTO ativar(Long id) {
        Usuario adm = getUsuarioLogado();
        Categoria categoria = buscarEntidadePorId(id);

        if (Boolean.TRUE.equals(categoria.getAtivo())) {
            throw new RegraDeNegocioException("Categoria já está ativa.");
        }

        categoria.setAtivo(true);
        logService.registrar(TipoLog.ALTERACAO,
                "Categoria '" + categoria.getNome() + "' ativada pelo ADM " + adm.getId(), adm);

        return mapper.toResponseDTO(categoria);
    }

    @Transactional
    public CategoriaResponseDTO desativar(Long id) {
        Usuario adm = getUsuarioLogado();
        Categoria categoria = buscarEntidadePorId(id);

        if (Boolean.FALSE.equals(categoria.getAtivo())) {
            throw new RegraDeNegocioException("Categoria já está inativa.");
        }

        List<StatusSolicitacao> statusFinais = List.of(StatusSolicitacao.FINALIZADA, StatusSolicitacao.REJEITADA);
        if (solicitacaoRepository.existsByCategoriaIdAndStatusNotIn(id, statusFinais)) {
            throw new RegraDeNegocioException(
                    "Não é possível desativar uma categoria com solicitações em andamento. " +
                    "Finalize ou redirecione as solicitações antes.");
        }

        categoria.setAtivo(false);
        logService.registrar(TipoLog.ALTERACAO,
                "Categoria '" + categoria.getNome() + "' desativada pelo ADM " + adm.getId(), adm);

        return mapper.toResponseDTO(categoria);
    }

    @Transactional
    public void excluir(Long id) {
        Usuario adm = getUsuarioLogado();
        Categoria categoria = buscarEntidadePorId(id);

        if (Boolean.TRUE.equals(categoria.getAtivo())) {
            throw new RegraDeNegocioException("Desative a categoria antes de excluí-la.");
        }

        if (solicitacaoRepository.existsByCategoriaId(id)) {
            throw new RegraDeNegocioException(
                    "Esta categoria possui solicitações vinculadas e não pode ser excluída. " +
                    "Considere mantê-la inativa.");
        }

        String nome = categoria.getNome();
        repository.deleteById(id);
        logService.registrar(TipoLog.EXCLUSAO,
                "Categoria '" + nome + "' excluída pelo ADM " + adm.getId(), adm);
    }

    @Transactional(readOnly = true)
    public Page<CategoriaResponseDTO> listarTodas(Boolean ativo, Pageable pageable) {
        if (pageable.getPageSize() > 100) {
            pageable = PageRequest.of(pageable.getPageNumber(), 20, pageable.getSort());
        }
        if (ativo != null) {
            return repository.findByAtivo(ativo, pageable).map(mapper::toResponseDTO);
        }
        return repository.findAll(pageable).map(mapper::toResponseDTO);
    }

    @Transactional(readOnly = true)
    public Page<CategoriaResponseDTO> listarAtivas(Pageable pageable) {
        if (pageable.getPageSize() > 100) {
            pageable = PageRequest.of(pageable.getPageNumber(), 20, pageable.getSort());
        }
        return repository.findByAtivo(true, pageable).map(mapper::toResponseDTO);
    }

    private Categoria buscarEntidadePorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Categoria não encontrada."));
    }
}
