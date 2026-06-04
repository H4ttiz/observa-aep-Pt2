package com.unicesumar.observa_acao.repository;

import com.unicesumar.observa_acao.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

    boolean existsByNome(String nome);

    List<Categoria> findAllByAtivaTrue();
}