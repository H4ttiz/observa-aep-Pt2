package com.unicesumar.observa_acao.dto.auth;

import com.unicesumar.observa_acao.dto.endereco.EnderecoUsuarioRequestDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CidadaoRequestDTO(

        @NotBlank
        String nome,

        @NotBlank @Email
        String email,

        @NotBlank
        String senha,

        @NotBlank
        String cpf,

        String celular,

        @NotNull @Valid
        EnderecoUsuarioRequestDTO enderecoUsuario
) {
}
