package com.unicesumar.observa_acao.dto.imagem;

import java.time.LocalDateTime;

public record ImagemSolicitacaoResponseDTO(
        Long id,
        String url,
        LocalDateTime dataUpload
) {
}
