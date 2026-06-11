package com.unicesumar.observa_acao.dto.endereco;

public record EnderecoSolicitacaoResponseDTO(
        Long id,
        String cep,
        String logradouro,
        String numero,
        String complemento,
        String bairro,
        String cidade,
        String estado
) {
}
