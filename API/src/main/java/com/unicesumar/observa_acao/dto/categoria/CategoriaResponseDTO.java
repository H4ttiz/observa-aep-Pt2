package com.unicesumar.observa_acao.dto.categoria;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class CategoriaResponseDTO {

    private Long id;

    private String nome;

    private String descricao;

    private Boolean ativa;
}
