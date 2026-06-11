package com.unicesumar.observa_acao.dto.endereco;

public record CepResponseDTO(
        String cep,
        String logradouro,
        String complemento,
        String bairro,
        String cidade,
        String estado
) {
}
