package com.unicesumar.observa_acao.dto.auth;

import com.unicesumar.observa_acao.enums.TipoUsuario;

public record LoginResponseDTO(

        Long userId,
        String accessToken,
        String refreshToken,
        TipoUsuario tipoUsuario,
        String nomeUsuario,
        long expiresIn
) {
}
