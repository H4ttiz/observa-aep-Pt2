package com.unicesumar.observa_acao.service;

import com.unicesumar.observa_acao.dto.auth.CidadaoRequestDTO;
import com.unicesumar.observa_acao.dto.auth.LoginRequestDTO;
import com.unicesumar.observa_acao.dto.auth.LoginResponseDTO;
import com.unicesumar.observa_acao.dto.auth.RefreshTokenRequestDTO;
import com.unicesumar.observa_acao.dto.usuario.UsuarioResponseDTO;
import com.unicesumar.observa_acao.enums.TipoUsuario;
import com.unicesumar.observa_acao.exception.NotFoundException;
import com.unicesumar.observa_acao.exception.RegraDeNegocioException;
import com.unicesumar.observa_acao.mapper.UsuarioMapper;
import com.unicesumar.observa_acao.model.RefreshToken;
import com.unicesumar.observa_acao.model.Usuario;
import com.unicesumar.observa_acao.repository.UsuarioRepository;
import com.unicesumar.observa_acao.util.CpfUtil;
import com.unicesumar.observa_acao.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UsuarioRepository usuarioRepository;
    private final JwtUtil jwtUtil;
    private final RefreshTokenService refreshTokenService;
    private final PasswordEncoder passwordEncoder;
    private final UsuarioMapper usuarioMapper;

    @Transactional
    public LoginResponseDTO login(LoginRequestDTO dto) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.email(), dto.senha())
        );

        Usuario usuario = usuarioRepository.findByEmail(dto.email())
                .orElseThrow(() -> new NotFoundException("Usuário não encontrado"));

        if (!usuario.isEnabled()) {
            throw new RegraDeNegocioException("Usuário inativo");
        }

        String accessToken = jwtUtil.gerarToken(usuario);
        RefreshToken refreshToken = refreshTokenService.criarRefreshToken(usuario);

        return new LoginResponseDTO(
                usuario.getId(),
                accessToken,
                refreshToken.getToken(),
                usuario.getTipoUsuario(),
                usuario.getNome(),
                jwtUtil.getExpiration()
        );
    }

    @Transactional
    public LoginResponseDTO refreshToken(RefreshTokenRequestDTO dto) {
        RefreshToken refreshToken = refreshTokenService.validarRefreshToken(dto.refreshToken());
        Usuario usuario = refreshToken.getUsuario();

        RefreshToken novoRefreshToken = refreshTokenService.rotacionarRefreshToken(refreshToken);
        String novoAccessToken = jwtUtil.gerarToken(usuario);

        return new LoginResponseDTO(
                usuario.getId(),
                novoAccessToken,
                novoRefreshToken.getToken(),
                usuario.getTipoUsuario(),
                usuario.getNome(),
                jwtUtil.getExpiration()
        );
    }

    @Transactional
    public void logout(RefreshTokenRequestDTO dto) {
        RefreshToken refreshToken = refreshTokenService.validarRefreshToken(dto.refreshToken());
        refreshTokenService.revogarTodosDoUsuario(refreshToken.getUsuario());
    }

    @Transactional
    public UsuarioResponseDTO cadastrarCidadao(CidadaoRequestDTO dto) {
        String email = dto.email().trim().toLowerCase();
        String cpf = CpfUtil.normalizar(dto.cpf());

        if (!CpfUtil.isCpfValido(cpf)) {
            throw new RegraDeNegocioException("CPF inválido");
        }

        if (usuarioRepository.existsByEmail(email)) {
            throw new RegraDeNegocioException("Já existe um usuário com este email");
        }

        if (usuarioRepository.existsByCpf(cpf)) {
            throw new RegraDeNegocioException("Já existe um usuário com este CPF");
        }

        Usuario usuario = usuarioMapper.toEntity(dto);
        usuario.setSenha(passwordEncoder.encode(dto.senha()));
        usuario.setTipoUsuario(TipoUsuario.CIDADAO);
        usuario.setAtivo(true);
        usuario.setDataCriacao(LocalDateTime.now());

        Usuario salvo = usuarioRepository.save(usuario);

        return usuarioMapper.toResponseDTO(salvo);
    }
}
