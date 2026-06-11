package com.unicesumar.observa_acao.mapper;

import com.unicesumar.observa_acao.dto.endereco.EnderecoUsuarioRequestDTO;
import com.unicesumar.observa_acao.dto.endereco.EnderecoUsuarioResponseDTO;
import com.unicesumar.observa_acao.model.EnderecoUsuario;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface EnderecoUsuarioMapper {

    EnderecoUsuarioResponseDTO toResponseDTO(EnderecoUsuario enderecoUsuario);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "usuario", ignore = true)
    EnderecoUsuario toEntity(EnderecoUsuarioRequestDTO dto);
}
