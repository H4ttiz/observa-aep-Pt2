package com.unicesumar.observa_acao.dto.categoria;

import java.time.LocalDateTime;

public record CategoriaResponseDTO(
        Long id,
        String nome,
        String descricao,
        Boolean ativo,
        LocalDateTime dataCriacao,
        Long criadoPorId,
        String criadoPorNome
) {
}
