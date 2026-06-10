package com.unicesumar.observa_acao.dto.categoria;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CategoriaRequestDTO(

        @NotBlank(message = "Nome é obrigatório")
        @Size(max = 100, message = "Nome deve ter no máximo 100 caracteres")
        String nome,

        @NotBlank(message = "Descrição é obrigatória")
        @Size(max = 500, message = "Descrição deve ter no máximo 500 caracteres")
        String descricao
) {
}
