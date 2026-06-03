package com.unicesumar.observa_acao.repository;

import com.unicesumar.observa_acao.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
}
