package com.unicesumar.observa_acao.repository;

import com.unicesumar.observa_acao.enums.StatusSolicitacao;
import com.unicesumar.observa_acao.model.Solicitacao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SolicitacaoRepository extends JpaRepository<Solicitacao, Long> {

    boolean existsByCategoriaId(Long categoriaId);

    boolean existsByCategoriaIdAndStatusNotIn(Long categoriaId, List<StatusSolicitacao> statuses);

    Page<Solicitacao> findBySolicitanteId(Long solicitanteId, Pageable pageable);

    Page<Solicitacao> findByStatus(StatusSolicitacao status, Pageable pageable);

    Page<Solicitacao> findByAtendenteIdAndStatus(Long atendenteId, StatusSolicitacao status, Pageable pageable);

    Page<Solicitacao> findByAtendenteId(Long atendenteId, Pageable pageable);

    Page<Solicitacao> findByStatusIn(List<StatusSolicitacao> statuses, Pageable pageable);
}
