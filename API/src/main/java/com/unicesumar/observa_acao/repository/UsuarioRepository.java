package com.unicesumar.observa_acao.repository;

import com.unicesumar.observa_acao.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
}
