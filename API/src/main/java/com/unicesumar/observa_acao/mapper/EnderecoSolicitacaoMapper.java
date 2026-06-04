package com.unicesumar.observa_acao.mapper;

import com.unicesumar.observa_acao.dto.endereco.EnderecoSolicitacaoRequestDTO;
import com.unicesumar.observa_acao.dto.endereco.EnderecoSolicitacaoResponseDTO;
import com.unicesumar.observa_acao.model.EnderecoSolicitacao;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface EnderecoSolicitacaoMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "logradouro",  source = "logradouro")
    @Mapping(target = "bairro",      source = "bairro")
    @Mapping(target = "cidade",      source = "cidade")
    @Mapping(target = "estado",      source = "estado")
    @Mapping(target = "cep",         source = "cep")
    EnderecoSolicitacao toEntity(EnderecoSolicitacaoRequestDTO dto);

    EnderecoSolicitacaoResponseDTO toResponseDTO(EnderecoSolicitacao entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "logradouro",  source = "logradouro")
    @Mapping(target = "bairro",      source = "bairro")
    @Mapping(target = "cidade",      source = "cidade")
    @Mapping(target = "estado",      source = "estado")
    @Mapping(target = "cep",         source = "cep")
    void updateEntityFromDTO(EnderecoSolicitacaoRequestDTO dto, @MappingTarget EnderecoSolicitacao entity);
}
