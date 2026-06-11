package com.unicesumar.observa_acao.dto.solicitacao;

import jakarta.validation.constraints.NotBlank;

public record RevealAnonimatoDTO(
        @NotBlank(message = "Senha do administrador é obrigatória")
        String senhaAdm,

        @NotBlank(message = "Observação é obrigatória")
        String observacao
) {
}
