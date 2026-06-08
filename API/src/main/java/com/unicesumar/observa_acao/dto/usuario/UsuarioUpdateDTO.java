package com.unicesumar.observa_acao.dto.usuario;

import com.unicesumar.observa_acao.enums.TipoUsuario;
import jakarta.validation.constraints.Email;

public record UsuarioUpdateDTO(

        String nome,

        @Email
        String email,

        String cpf,

        String celular,

        TipoUsuario tipoUsuario
) {
}
