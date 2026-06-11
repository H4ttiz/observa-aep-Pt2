package com.unicesumar.observa_acao.dto.endereco;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record EnderecoSolicitacaoRequestDTO(
        @NotBlank(message = "CEP é obrigatório")
        @Pattern(regexp = "\\d{5}-?\\d{3}", message = "CEP inválido")
        String cep,

        @NotBlank(message = "Logradouro é obrigatório")
        @Size(max = 255)
        String logradouro,

        @NotBlank(message = "Número é obrigatório")
        @Size(max = 20)
        String numero,

        String complemento,

        @NotBlank(message = "Bairro é obrigatório")
        @Size(max = 100)
        String bairro,

        @NotBlank(message = "Cidade é obrigatória")
        @Size(max = 100)
        String cidade,

        @NotBlank(message = "Estado é obrigatório")
        @Size(min = 2, max = 2, message = "Estado deve ter 2 caracteres")
        String estado
) {
}
