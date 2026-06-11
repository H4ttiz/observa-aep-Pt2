package com.unicesumar.observa_acao.repository;

import com.unicesumar.observa_acao.model.ImagemSolicitacao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ImagemSolicitacaoRepository extends JpaRepository<ImagemSolicitacao, Long> {

    long countBySolicitacaoId(Long solicitacaoId);

    Optional<ImagemSolicitacao> findByIdAndSolicitacaoId(Long id, Long solicitacaoId);
}
