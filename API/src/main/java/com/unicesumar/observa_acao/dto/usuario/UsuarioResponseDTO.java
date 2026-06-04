package com.unicesumar.observa_acao.dto.usuario;

import com.unicesumar.observa_acao.enums.TipoUsuario;

import java.time.LocalDateTime;

public record UsuarioResponseDTO(

        Long id,
        String nome,
        String email,
        String cpf,
        String celular,
        TipoUsuario tipoUsuario,
        Boolean ativo,
        LocalDateTime dataCriacao
) {
}
