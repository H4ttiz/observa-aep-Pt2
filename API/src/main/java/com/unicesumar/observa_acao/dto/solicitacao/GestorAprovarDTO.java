package com.unicesumar.observa_acao.dto.solicitacao;

import com.unicesumar.observa_acao.enums.NivelPrioridade;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record GestorAprovarDTO(
        @NotNull(message = "Prioridade é obrigatória")
        NivelPrioridade prioridade,

        @NotNull(message = "Data de prazo é obrigatória")
        LocalDateTime dataPrazo
) {
}
