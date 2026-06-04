package com.unicesumar.observa_acao.dto.endereco;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class EnderecoSolicitacaoRequestDTO {

    @NotBlank(message = "Logradouro é obrigatório")
    private String logradouro;

    private String numero;

    private String complemento;

    @NotBlank(message = "Bairro é obrigatório")
    private String bairro;

    @NotBlank(message = "Cidade é obrigatória")
    private String cidade;

    @NotBlank(message = "Estado é obrigatório")
    @Size(min = 2, max = 2, message = "Estado deve ter 2 caracteres")
    private String estado;

    @NotBlank(message = "CEP é obrigatório")
    @Size(min = 9, max = 9, message = "CEP deve ter o formato 00000-000")
    private String cep;

    private Double latitude;

    private Double longitude;
}
