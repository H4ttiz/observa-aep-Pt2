package com.unicesumar.observa_acao.dto.usuario;

import jakarta.validation.constraints.Size;

public record UsuarioSelfUpdateDTO(

        String nome,

        String celular,

        String senhaAtual,

        @Size(min = 8)
        String novaSenha,

        String confirmarNovaSenha
) {
}
