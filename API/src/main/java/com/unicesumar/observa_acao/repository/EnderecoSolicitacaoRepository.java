package com.unicesumar.observa_acao.repository;

import com.unicesumar.observa_acao.model.EnderecoSolicitacao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EnderecoSolicitacaoRepository extends JpaRepository<EnderecoSolicitacao, Long> {

    Optional<EnderecoSolicitacao> findBySolicitacaoId(Long solicitacaoId);

    boolean existsBySolicitacaoId(Long solicitacaoId);
}
