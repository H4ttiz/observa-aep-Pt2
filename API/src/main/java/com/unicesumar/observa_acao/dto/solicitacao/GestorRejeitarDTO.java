package com.unicesumar.observa_acao.dto.solicitacao;

import jakarta.validation.constraints.NotBlank;

public record GestorRejeitarDTO(
        @NotBlank(message = "Observação é obrigatória para rejeitar uma solicitação")
        String observacao
) {
}
