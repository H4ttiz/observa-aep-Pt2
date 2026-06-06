package com.unicesumar.observa_acao.repository;

import com.unicesumar.observa_acao.enums.TipoUsuario;
import com.unicesumar.observa_acao.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByEmail(String email);

    Optional<Usuario> findByCpf(String cpf);

    boolean existsByEmail(String email);

    boolean existsByCpf(String cpf);

    List<Usuario> findByTipoUsuario(TipoUsuario tipoUsuario);

    List<Usuario> findByAtivo(Boolean ativo);
}
