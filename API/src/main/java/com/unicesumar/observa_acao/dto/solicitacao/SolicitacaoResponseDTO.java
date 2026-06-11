package com.unicesumar.observa_acao.dto.solicitacao;

import com.unicesumar.observa_acao.dto.endereco.EnderecoSolicitacaoResponseDTO;
import com.unicesumar.observa_acao.dto.historico.HistoricoResponseDTO;
import com.unicesumar.observa_acao.dto.imagem.ImagemSolicitacaoResponseDTO;
import com.unicesumar.observa_acao.enums.NivelPrioridade;
import com.unicesumar.observa_acao.enums.StatusSolicitacao;

import java.time.LocalDateTime;
import java.util.List;

public record SolicitacaoResponseDTO(
        Long id,
        String titulo,
        String descricao,
        StatusSolicitacao status,
        NivelPrioridade prioridade,
        Boolean anonima,
        LocalDateTime dataAbertura,
        LocalDateTime dataPrazo,
        LocalDateTime dataFinalizacao,
        Long categoriaId,
        String categoriaNome,
        EnderecoSolicitacaoResponseDTO enderecoSolicitacao,
        List<ImagemSolicitacaoResponseDTO> imagens,
        List<HistoricoResponseDTO> historicos,
        Long solicitanteId,
        String solicitanteNome,
        Long atendenteId,
        String atendenteNome
) {
}
