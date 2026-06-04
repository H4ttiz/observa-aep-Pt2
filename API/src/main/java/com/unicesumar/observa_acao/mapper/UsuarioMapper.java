package com.unicesumar.observa_acao.mapper;

import com.unicesumar.observa_acao.dto.auth.CidadaoRequestDTO;
import com.unicesumar.observa_acao.dto.usuario.UsuarioResponseDTO;
import com.unicesumar.observa_acao.model.Usuario;
import com.unicesumar.observa_acao.util.CpfUtil;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", imports = {CpfUtil.class})
public interface UsuarioMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "senha", ignore = true)
    @Mapping(target = "tipoUsuario", ignore = true)
    @Mapping(target = "ativo", ignore = true)
    @Mapping(target = "dataCriacao", ignore = true)
    @Mapping(target = "criadoPor", ignore = true)
    @Mapping(target = "fotoPerfil", ignore = true)
    @Mapping(target = "nome",  expression = "java(dto.nome().trim())")
    @Mapping(target = "email", expression = "java(dto.email().trim().toLowerCase())")
    @Mapping(target = "cpf",   expression = "java(CpfUtil.normalizar(dto.cpf()))")
    Usuario toEntity(CidadaoRequestDTO dto);

    UsuarioResponseDTO toResponseDTO(Usuario usuario);
}
