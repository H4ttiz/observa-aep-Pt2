package com.unicesumar.observa_acao.mapper;

import com.unicesumar.observa_acao.dto.categoria.CategoriaRequestDTO;
import com.unicesumar.observa_acao.dto.categoria.CategoriaResponseDTO;
import com.unicesumar.observa_acao.model.Categoria;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CategoriaMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "nome",     source = "nome")
    @Mapping(target = "ativa",    source = "ativa")
    Categoria toEntity(CategoriaRequestDTO dto);

    CategoriaResponseDTO toResponseDTO(Categoria entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "nome",     source = "nome")
    @Mapping(target = "ativa",    source = "ativa")
    void updateEntityFromDTO(CategoriaRequestDTO dto, @MappingTarget Categoria entity);
}