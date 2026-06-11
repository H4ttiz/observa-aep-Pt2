package com.unicesumar.observa_acao.mapper;

import com.unicesumar.observa_acao.dto.endereco.EnderecoSolicitacaoRequestDTO;
import com.unicesumar.observa_acao.dto.endereco.EnderecoSolicitacaoResponseDTO;
import com.unicesumar.observa_acao.model.EnderecoSolicitacao;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface EnderecoSolicitacaoMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "solicitacao", ignore = true)
    @Mapping(target = "latitude", ignore = true)
    @Mapping(target = "longitude", ignore = true)
    EnderecoSolicitacao toEntity(EnderecoSolicitacaoRequestDTO dto);

    EnderecoSolicitacaoResponseDTO toResponseDTO(EnderecoSolicitacao entity);
}
