package com.unicesumar.observa_acao.dto.auth;

import jakarta.validation.constraints.NotBlank;

public record RefreshTokenRequestDTO(

        @NotBlank
        String refreshToken
) {
}
