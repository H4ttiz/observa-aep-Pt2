package com.unicesumar.observa_acao.repository;

import com.unicesumar.observa_acao.model.HistoricoSolicitacao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HistoricoSolicitacaoRepository extends JpaRepository<HistoricoSolicitacao, Long> {

    List<HistoricoSolicitacao> findBySolicitacaoIdOrderByDataAlteracaoAsc(Long solicitacaoId);
}
