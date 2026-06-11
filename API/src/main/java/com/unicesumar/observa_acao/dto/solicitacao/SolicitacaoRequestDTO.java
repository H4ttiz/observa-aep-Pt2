package com.unicesumar.observa_acao.dto.solicitacao;

import com.unicesumar.observa_acao.dto.endereco.EnderecoSolicitacaoRequestDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record SolicitacaoRequestDTO(
        @NotBlank(message = "Título é obrigatório")
        String titulo,

        @NotBlank(message = "Descrição é obrigatória")
        String descricao,

        @NotNull(message = "Categoria é obrigatória")
        Long categoriaId,

        @NotNull(message = "Informe se a solicitação é anônima")
        Boolean anonima,

        @NotNull(message = "Informe se deseja usar o endereço do cadastro")
        Boolean usarEnderecoUsuario,

        @Valid
        EnderecoSolicitacaoRequestDTO enderecoSolicitacao,

        @NotNull(message = "Data de abertura é obrigatória")
        LocalDateTime dataAbertura
) {
}
