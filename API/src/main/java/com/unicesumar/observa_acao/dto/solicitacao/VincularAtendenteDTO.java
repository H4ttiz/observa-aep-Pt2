package com.unicesumar.observa_acao.dto.solicitacao;

import jakarta.validation.constraints.NotNull;

public record VincularAtendenteDTO(
        @NotNull(message = "ID do atendente é obrigatório")
        Long atendenteId
) {
}
