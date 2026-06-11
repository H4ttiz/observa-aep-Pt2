package com.unicesumar.observa_acao.dto.solicitacao;

import com.unicesumar.observa_acao.dto.endereco.EnderecoSolicitacaoRequestDTO;
import jakarta.validation.Valid;

public record SolicitacaoUpdateDTO(
        String titulo,
        String descricao,
        Long categoriaId,
        @Valid EnderecoSolicitacaoRequestDTO enderecoSolicitacao
) {
}
