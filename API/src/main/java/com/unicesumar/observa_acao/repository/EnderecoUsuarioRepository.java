package com.unicesumar.observa_acao.repository;

import com.unicesumar.observa_acao.model.EnderecoUsuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EnderecoUsuarioRepository extends JpaRepository<EnderecoUsuario, Long> {

    Optional<EnderecoUsuario> findByUsuarioId(Long usuarioId);

    boolean existsByUsuarioId(Long usuarioId);
}
