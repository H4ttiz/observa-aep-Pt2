package com.unicesumar.observa_acao.mapper;

import com.unicesumar.observa_acao.dto.log.LogResponseDTO;
import com.unicesumar.observa_acao.model.Log;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface LogMapper {

    @Mapping(target = "nomeUsuario", source = "usuario.nome")
    @Mapping(target = "dataCriacao", source = "dataRegistro")
    LogResponseDTO toResponseDTO(Log log);
}
