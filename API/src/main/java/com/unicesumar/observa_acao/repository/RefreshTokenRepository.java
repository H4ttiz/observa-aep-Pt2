package com.unicesumar.observa_acao.repository;

import com.unicesumar.observa_acao.model.RefreshToken;
import com.unicesumar.observa_acao.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    Optional<RefreshToken> findByToken(String token);

    List<RefreshToken> findAllByUsuario(Usuario usuario);

    void deleteAllByUsuario(Usuario usuario);
}
