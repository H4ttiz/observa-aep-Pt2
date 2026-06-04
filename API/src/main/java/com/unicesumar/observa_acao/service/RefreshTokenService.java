package com.unicesumar.observa_acao.service;

import com.unicesumar.observa_acao.exception.NotFoundException;
import com.unicesumar.observa_acao.exception.RegraDeNegocioException;
import com.unicesumar.observa_acao.model.RefreshToken;
import com.unicesumar.observa_acao.model.Usuario;
import com.unicesumar.observa_acao.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;

    @Transactional
    public RefreshToken criarRefreshToken(Usuario usuario) {
        RefreshToken refreshToken = RefreshToken.builder()
                .token(UUID.randomUUID().toString())
                .usuario(usuario)
                .expiracaoAt(LocalDateTime.now().plusDays(7))
                .revogado(false)
                .build();

        return refreshTokenRepository.save(refreshToken);
    }

    @Transactional
    public RefreshToken validarRefreshToken(String token) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new NotFoundException("Refresh token não encontrado"));

        if (refreshToken.isRevogado()) {
            throw new RegraDeNegocioException("Refresh token revogado");
        }

        if (refreshToken.getExpiracaoAt().isBefore(LocalDateTime.now())) {
            refreshTokenRepository.delete(refreshToken);
            throw new RegraDeNegocioException("Refresh token expirado");
        }

        return refreshToken;
    }

    @Transactional
    public void revogarTodosDoUsuario(Usuario usuario) {
        refreshTokenRepository.deleteAllByUsuario(usuario);
    }

    @Transactional
    public RefreshToken rotacionarRefreshToken(RefreshToken tokenAntigo) {
        refreshTokenRepository.delete(tokenAntigo);
        return criarRefreshToken(tokenAntigo.getUsuario());
    }
}
