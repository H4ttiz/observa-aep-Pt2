package com.unicesumar.observa_acao.dto.historico;

import com.unicesumar.observa_acao.enums.StatusSolicitacao;

import java.time.LocalDateTime;

public record HistoricoResponseDTO(
        Long id,
        StatusSolicitacao statusAnterior,
        StatusSolicitacao statusNovo,
        String observacao,
        Long responsavelId,
        String responsavelNome,
        LocalDateTime dataAlteracao
) {
}
