package com.unicesumar.observa_acao.dto.solicitacao;

import com.unicesumar.observa_acao.dto.endereco.EnderecoSolicitacaoRequestDTO;
import com.unicesumar.observa_acao.enums.NivelPrioridade;
import com.unicesumar.observa_acao.enums.StatusSolicitacao;
import jakarta.validation.Valid;

import java.time.LocalDateTime;

public record SolicitacaoAdmUpdateDTO(
        String titulo,
        String descricao,
        Long categoriaId,
        StatusSolicitacao status,
        NivelPrioridade prioridade,
        LocalDateTime dataPrazo,
        LocalDateTime dataFinalizacao,
        @Valid EnderecoSolicitacaoRequestDTO enderecoSolicitacao
) {
}
