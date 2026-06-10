package com.unicesumar.observa_acao.mapper;

import com.unicesumar.observa_acao.dto.categoria.CategoriaRequestDTO;
import com.unicesumar.observa_acao.dto.categoria.CategoriaResponseDTO;
import com.unicesumar.observa_acao.model.Categoria;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CategoriaMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "ativo", ignore = true)
    @Mapping(target = "dataCriacao", ignore = true)
    @Mapping(target = "criadoPor", ignore = true)
    @Mapping(target = "nome", expression = "java(dto.nome().trim())")
    @Mapping(target = "descricao", expression = "java(dto.descricao().trim())")
    Categoria toEntity(CategoriaRequestDTO dto);

    @Mapping(target = "criadoPorId", source = "criadoPor.id")
    @Mapping(target = "criadoPorNome", source = "criadoPor.nome")
    CategoriaResponseDTO toResponseDTO(Categoria entity);

    List<CategoriaResponseDTO> toResponseDTOList(List<Categoria> categorias);
}
