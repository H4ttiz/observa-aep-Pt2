package com.unicesumar.observa_acao.dto.endereco;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record EnderecoUsuarioRequestDTO(

        @NotBlank @Pattern(regexp = "\\d{5}-?\\d{3}", message = "CEP inválido")
        String cep,

        @NotBlank @Size(max = 255)
        String logradouro,

        @NotBlank @Size(max = 20)
        String numero,

        String complemento,

        @NotBlank @Size(max = 100)
        String bairro,

        @NotBlank @Size(max = 100)
        String cidade,

        @NotBlank @Size(min = 2, max = 2)
        String estado
) {
}
