package com.unicesumar.observa_acao.dto.usuario;

import com.unicesumar.observa_acao.dto.endereco.EnderecoUsuarioResponseDTO;
import com.unicesumar.observa_acao.enums.TipoUsuario;

import java.time.LocalDateTime;

public record UsuarioResponseDTO(

        Long id,
        String nome,
        String email,
        String cpf,
        String celular,
        String fotoPerfil,
        TipoUsuario tipoUsuario,
        Boolean ativo,
        LocalDateTime dataCriacao,
        Long criadoPorId,
        String criadoPorNome,
        EnderecoUsuarioResponseDTO enderecoUsuario
) {
}
