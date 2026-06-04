package com.unicesumar.observa_acao.service;

import com.unicesumar.observa_acao.dto.auth.LoginRequestDTO;
import com.unicesumar.observa_acao.dto.auth.LoginResponseDTO;
import com.unicesumar.observa_acao.dto.auth.RefreshTokenRequestDTO;
import com.unicesumar.observa_acao.exception.NotFoundException;
import com.unicesumar.observa_acao.exception.RegraDeNegocioException;
import com.unicesumar.observa_acao.model.RefreshToken;
import com.unicesumar.observa_acao.model.Usuario;
import com.unicesumar.observa_acao.repository.UsuarioRepository;
import com.unicesumar.observa_acao.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UsuarioRepository usuarioRepository;
    private final JwtUtil jwtUtil;
    private final RefreshTokenService refreshTokenService;

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
}
