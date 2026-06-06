package com.unicesumar.observa_acao.service;

import com.unicesumar.observa_acao.dto.usuario.UsuarioRequestDTO;
import com.unicesumar.observa_acao.dto.usuario.UsuarioResponseDTO;
import com.unicesumar.observa_acao.dto.usuario.UsuarioSelfUpdateDTO;
import com.unicesumar.observa_acao.dto.usuario.UsuarioUpdateDTO;
import com.unicesumar.observa_acao.enums.TipoLog;
import com.unicesumar.observa_acao.exception.AcessoNegadoException;
import com.unicesumar.observa_acao.exception.NotFoundException;
import com.unicesumar.observa_acao.exception.RegraDeNegocioException;
import com.unicesumar.observa_acao.mapper.UsuarioMapper;
import com.unicesumar.observa_acao.model.Usuario;
import com.unicesumar.observa_acao.repository.UsuarioRepository;
import com.unicesumar.observa_acao.util.CpfUtil;
import com.unicesumar.observa_acao.util.LogUtil;
import com.unicesumar.observa_acao.util.ValidacaoUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final UsuarioMapper usuarioMapper;
    private final LogUtil logUtil;

    private Usuario getUsuarioLogado() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Usuário autenticado não encontrado"));
    }

    private void verificarPermissaoAdm(Usuario alvo, Usuario admLogado) {
        if (alvo.getCriadoPor() == null) {
            throw new AcessoNegadoException("Não é possível modificar o administrador raiz");
        }
        if (!alvo.getCriadoPor().getId().equals(admLogado.getId())) {
            throw new AcessoNegadoException("Você não tem permissão para modificar este usuário");
        }
    }

    @Transactional
    public UsuarioResponseDTO criarUsuario(UsuarioRequestDTO dto) {
        Usuario admLogado = getUsuarioLogado();

        if (!dto.senha().equals(dto.confirmarSenha())) {
            throw new RegraDeNegocioException("As senhas não coincidem");
        }

        String email = dto.email().trim().toLowerCase();
        String cpf = CpfUtil.normalizar(dto.cpf());

        if (!CpfUtil.isCpfValido(cpf)) {
            throw new RegraDeNegocioException("CPF inválido");
        }

        if (dto.celular() != null && !dto.celular().isBlank() && !ValidacaoUtil.celularValido(dto.celular())) {
            throw new RegraDeNegocioException("Celular inválido");
        }

        if (usuarioRepository.existsByEmail(email)) {
            throw new RegraDeNegocioException("Já existe um usuário com este email");
        }

        if (usuarioRepository.existsByCpf(cpf)) {
            throw new RegraDeNegocioException("Já existe um usuário com este CPF");
        }

        Usuario usuario = usuarioMapper.toEntity(dto);
        usuario.setSenha(passwordEncoder.encode(dto.senha()));
        usuario.setTipoUsuario(dto.tipoUsuario());
        usuario.setAtivo(true);
        usuario.setDataCriacao(LocalDateTime.now());
        usuario.setCriadoPor(admLogado);

        Usuario salvo = usuarioRepository.save(usuario);
        logUtil.registrar(TipoLog.CRIACAO, "Usuário criado: " + salvo.getEmail(), admLogado);

        return usuarioMapper.toResponseDTO(salvo);
    }

    @Transactional
    public UsuarioResponseDTO atualizarUsuario(Long id, UsuarioUpdateDTO dto) {
        Usuario admLogado = getUsuarioLogado();
        Usuario alvo = usuarioRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Usuário não encontrado"));

        verificarPermissaoAdm(alvo, admLogado);

        if (dto.nome() != null && !dto.nome().isBlank()) {
            alvo.setNome(dto.nome().trim());
        }

        if (dto.email() != null && !dto.email().isBlank()) {
            String email = dto.email().trim().toLowerCase();
            if (!email.equals(alvo.getEmail()) && usuarioRepository.existsByEmail(email)) {
                throw new RegraDeNegocioException("Já existe um usuário com este email");
            }
            alvo.setEmail(email);
        }

        if (dto.cpf() != null && !dto.cpf().isBlank()) {
            String cpf = CpfUtil.normalizar(dto.cpf());
            if (!CpfUtil.isCpfValido(cpf)) {
                throw new RegraDeNegocioException("CPF inválido");
            }
            if (!cpf.equals(alvo.getCpf()) && usuarioRepository.existsByCpf(cpf)) {
                throw new RegraDeNegocioException("Já existe um usuário com este CPF");
            }
            alvo.setCpf(cpf);
        }

        if (dto.celular() != null) {
            if (!dto.celular().isBlank() && !ValidacaoUtil.celularValido(dto.celular())) {
                throw new RegraDeNegocioException("Celular inválido");
            }
            alvo.setCelular(dto.celular().isBlank() ? null : ValidacaoUtil.normalizarCelular(dto.celular()));
        }

        if (dto.tipoUsuario() != null) {
            alvo.setTipoUsuario(dto.tipoUsuario());
        }

        logUtil.registrar(TipoLog.ALTERACAO, "Usuário atualizado: " + alvo.getEmail(), admLogado);

        return usuarioMapper.toResponseDTO(alvo);
    }

    @Transactional
    public UsuarioResponseDTO atualizarSelf(UsuarioSelfUpdateDTO dto) {
        Usuario usuario = getUsuarioLogado();

        if (dto.nome() != null && !dto.nome().isBlank()) {
            usuario.setNome(dto.nome().trim());
        }

        if (dto.celular() != null) {
            if (!dto.celular().isBlank() && !ValidacaoUtil.celularValido(dto.celular())) {
                throw new RegraDeNegocioException("Celular inválido");
            }
            usuario.setCelular(dto.celular().isBlank() ? null : ValidacaoUtil.normalizarCelular(dto.celular()));
        }

        if (dto.novaSenha() != null && !dto.novaSenha().isBlank()) {
            if (dto.senhaAtual() == null || dto.senhaAtual().isBlank()) {
                throw new RegraDeNegocioException("Senha atual é obrigatória para alterar a senha");
            }
            if (!passwordEncoder.matches(dto.senhaAtual(), usuario.getSenha())) {
                throw new RegraDeNegocioException("Senha atual incorreta");
            }
            if (!dto.novaSenha().equals(dto.confirmarNovaSenha())) {
                throw new RegraDeNegocioException("As senhas não coincidem");
            }
            usuario.setSenha(passwordEncoder.encode(dto.novaSenha()));
        }

        logUtil.registrar(TipoLog.ALTERACAO, "Perfil atualizado pelo próprio usuário", usuario);

        return usuarioMapper.toResponseDTO(usuario);
    }

    @Transactional
    public UsuarioResponseDTO atualizarFotoPerfil(MultipartFile foto) {
        Usuario usuario = getUsuarioLogado();

        if (foto == null || foto.isEmpty()) {
            throw new RegraDeNegocioException("Arquivo de foto inválido");
        }

        String contentType = foto.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new RegraDeNegocioException("O arquivo deve ser uma imagem");
        }

        String originalName = foto.getOriginalFilename();
        String ext = (originalName != null && originalName.contains("."))
                ? originalName.substring(originalName.lastIndexOf('.'))
                : ".jpg";

        try {
            String filename = UUID.randomUUID() + ext;
            Path dir = Paths.get("uploads", "usuarios", usuario.getId().toString());
            Files.createDirectories(dir);
            Files.copy(foto.getInputStream(), dir.resolve(filename), StandardCopyOption.REPLACE_EXISTING);

            usuario.setFotoPerfil("uploads/usuarios/" + usuario.getId() + "/" + filename);
        } catch (IOException e) {
            throw new RegraDeNegocioException("Erro ao salvar foto de perfil");
        }

        return usuarioMapper.toResponseDTO(usuario);
    }

    @Transactional
    public UsuarioResponseDTO desativarUsuario(Long id) {
        Usuario admLogado = getUsuarioLogado();
        Usuario alvo = usuarioRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Usuário não encontrado"));

        verificarPermissaoAdm(alvo, admLogado);

        if (!alvo.getAtivo()) {
            throw new RegraDeNegocioException("Usuário já está inativo");
        }

        alvo.setAtivo(false);
        logUtil.registrar(TipoLog.ALTERACAO, "Usuário desativado: " + alvo.getEmail(), admLogado);

        return usuarioMapper.toResponseDTO(alvo);
    }

    @Transactional
    public UsuarioResponseDTO ativarUsuario(Long id) {
        Usuario admLogado = getUsuarioLogado();
        Usuario alvo = usuarioRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Usuário não encontrado"));

        verificarPermissaoAdm(alvo, admLogado);

        if (alvo.getAtivo()) {
            throw new RegraDeNegocioException("Usuário já está ativo");
        }

        alvo.setAtivo(true);
        logUtil.registrar(TipoLog.ALTERACAO, "Usuário ativado: " + alvo.getEmail(), admLogado);

        return usuarioMapper.toResponseDTO(alvo);
    }

    @Transactional
    public void excluirUsuario(Long id) {
        Usuario admLogado = getUsuarioLogado();
        Usuario alvo = usuarioRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Usuário não encontrado"));

        verificarPermissaoAdm(alvo, admLogado);

        if (alvo.getAtivo()) {
            throw new RegraDeNegocioException("Desative o usuário antes de excluí-lo");
        }

        String emailAlvo = alvo.getEmail();

        try {
            usuarioRepository.deleteById(id);
            usuarioRepository.flush();
        } catch (DataIntegrityViolationException e) {
            throw new RegraDeNegocioException("Não é possível excluir: usuário possui vínculos no sistema");
        }

        logUtil.registrar(TipoLog.EXCLUSAO, "Usuário excluído: " + emailAlvo, admLogado);
    }

    public List<UsuarioResponseDTO> listarTodos() {
        return usuarioMapper.toResponseDTOList(usuarioRepository.findAll());
    }

    public UsuarioResponseDTO buscarPorId(Long id) {
        return usuarioMapper.toResponseDTO(
                usuarioRepository.findById(id)
                        .orElseThrow(() -> new NotFoundException("Usuário não encontrado"))
        );
    }

    public UsuarioResponseDTO buscarPerfil() {
        return usuarioMapper.toResponseDTO(getUsuarioLogado());
    }
}
