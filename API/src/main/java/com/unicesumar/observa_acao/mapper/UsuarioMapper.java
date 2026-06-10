package com.unicesumar.observa_acao.mapper;

import com.unicesumar.observa_acao.dto.auth.CidadaoRequestDTO;
import com.unicesumar.observa_acao.dto.usuario.UsuarioRequestDTO;
import com.unicesumar.observa_acao.dto.usuario.UsuarioResponseDTO;
import com.unicesumar.observa_acao.model.Usuario;
import com.unicesumar.observa_acao.util.CpfUtil;
import com.unicesumar.observa_acao.util.FotoUrlHelper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", imports = {CpfUtil.class}, uses = {FotoUrlHelper.class, EnderecoUsuarioMapper.class})
public interface UsuarioMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "senha", ignore = true)
    @Mapping(target = "tipoUsuario", ignore = true)
    @Mapping(target = "ativo", ignore = true)
    @Mapping(target = "dataCriacao", ignore = true)
    @Mapping(target = "criadoPor", ignore = true)
    @Mapping(target = "fotoPerfil", ignore = true)
    @Mapping(target = "enderecoUsuario", ignore = true)
    @Mapping(target = "nome",  expression = "java(dto.nome().trim())")
    @Mapping(target = "email", expression = "java(dto.email().trim().toLowerCase())")
    @Mapping(target = "cpf",   expression = "java(CpfUtil.normalizar(dto.cpf()))")
    Usuario toEntity(CidadaoRequestDTO dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "senha", ignore = true)
    @Mapping(target = "tipoUsuario", ignore = true)
    @Mapping(target = "ativo", ignore = true)
    @Mapping(target = "dataCriacao", ignore = true)
    @Mapping(target = "criadoPor", ignore = true)
    @Mapping(target = "fotoPerfil", ignore = true)
    @Mapping(target = "enderecoUsuario", ignore = true)
    @Mapping(target = "nome",  expression = "java(dto.nome().trim())")
    @Mapping(target = "email", expression = "java(dto.email().trim().toLowerCase())")
    @Mapping(target = "cpf",   expression = "java(CpfUtil.normalizar(dto.cpf()))")
    Usuario toEntity(UsuarioRequestDTO dto);

    @Mapping(target = "fotoPerfil", source = "fotoPerfil", qualifiedByName = "buildFotoUrl")
    @Mapping(target = "criadoPorId", source = "criadoPor.id")
    @Mapping(target = "criadoPorNome", source = "criadoPor.nome")
    @Mapping(target = "enderecoUsuario", source = "enderecoUsuario")
    UsuarioResponseDTO toResponseDTO(Usuario usuario);

    List<UsuarioResponseDTO> toResponseDTOList(List<Usuario> usuarios);
}
