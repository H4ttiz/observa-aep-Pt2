package com.unicesumar.observa_acao.mapper;

import com.unicesumar.observa_acao.dto.historico.HistoricoResponseDTO;
import com.unicesumar.observa_acao.model.HistoricoSolicitacao;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface HistoricoMapper {

    @Mapping(target = "responsavelId",   source = "responsavel.id")
    @Mapping(target = "responsavelNome", source = "responsavel.nome")
    @Mapping(target = "dataAlteracao",   source = "dataAlteracao")
    HistoricoResponseDTO toResponseDTO(HistoricoSolicitacao historico);
}
