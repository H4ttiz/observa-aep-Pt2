package com.unicesumar.observa_acao.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record CidadaoRequestDTO(

        @NotBlank
        String nome,

        @NotBlank @Email
        String email,

        @NotBlank
        String senha,

        @NotBlank
        String cpf,

        String celular
) {
}
