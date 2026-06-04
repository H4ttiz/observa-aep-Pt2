package com.unicesumar.observa_acao.dto.endereco;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class EnderecoSolicitacaoResponseDTO {

    private Long id;

    private String logradouro;

    private String numero;

    private String complemento;

    private String bairro;

    private String cidade;

    private String estado;

    private String cep;

    private Double latitude;

    private Double longitude;
}
