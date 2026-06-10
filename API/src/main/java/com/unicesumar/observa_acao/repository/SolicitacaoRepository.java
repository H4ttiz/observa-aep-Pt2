package com.unicesumar.observa_acao.repository;

import com.unicesumar.observa_acao.enums.StatusSolicitacao;
import com.unicesumar.observa_acao.model.Solicitacao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SolicitacaoRepository extends JpaRepository<Solicitacao, Long> {

    boolean existsByCategoriaId(Long categoriaId);

    boolean existsByCategoriaIdAndStatusNotIn(Long categoriaId, List<StatusSolicitacao> statuses);
}
