package com.unicesumar.observa_acao.dto.log;

import com.unicesumar.observa_acao.enums.TipoLog;

import java.time.LocalDateTime;

public record LogResponseDTO(

        Long id,
        TipoLog tipoLog,
        String descricao,
        String nomeUsuario,
        LocalDateTime dataCriacao
) {
}
