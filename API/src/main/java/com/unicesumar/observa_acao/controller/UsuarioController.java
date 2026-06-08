package com.unicesumar.observa_acao.controller;

import com.unicesumar.observa_acao.dto.usuario.UsuarioRequestDTO;
import com.unicesumar.observa_acao.dto.usuario.UsuarioResponseDTO;
import com.unicesumar.observa_acao.dto.usuario.UsuarioSelfUpdateDTO;
import com.unicesumar.observa_acao.dto.usuario.UsuarioUpdateDTO;
import com.unicesumar.observa_acao.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;

@RestController
@RequestMapping("/usuarios")
@RequiredArgsConstructor
@Tag(name = "Usuários", description = "Gerenciamento de usuários e perfil")
public class UsuarioController {

    private final UsuarioService usuarioService;

    @GetMapping
    @Operation(summary = "Lista todos os usuários com paginação (ADM)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Página retornada com sucesso"),
            @ApiResponse(responseCode = "403", description = "Acesso negado")
    })
    public ResponseEntity<Page<UsuarioResponseDTO>> listarTodos(
            @PageableDefault(size = 20, sort = "nome", direction = Sort.Direction.ASC) Pageable pageable) {
        return ResponseEntity.ok(usuarioService.listarTodos(pageable));
    }

    @GetMapping("/perfil")
    @Operation(summary = "Retorna os dados do usuário autenticado")
    @ApiResponse(responseCode = "200", description = "Perfil retornado com sucesso")
    public ResponseEntity<UsuarioResponseDTO> buscarPerfil() {
        return ResponseEntity.ok(usuarioService.buscarPerfil());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Busca um usuário por ID (ADM)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Usuário encontrado"),
            @ApiResponse(responseCode = "404", description = "Usuário não encontrado")
    })
    public ResponseEntity<UsuarioResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.buscarPorId(id));
    }

    @PostMapping
    @Operation(summary = "Cria um novo usuário (ADM)")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Usuário criado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos ou já cadastrados")
    })
    public ResponseEntity<UsuarioResponseDTO> criarUsuario(@Valid @RequestBody UsuarioRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioService.criarUsuario(dto));
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Atualiza dados de um usuário (ADM)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Usuário atualizado"),
            @ApiResponse(responseCode = "403", description = "Permissão negada"),
            @ApiResponse(responseCode = "404", description = "Usuário não encontrado")
    })
    public ResponseEntity<UsuarioResponseDTO> atualizarUsuario(
            @PathVariable Long id,
            @Valid @RequestBody UsuarioUpdateDTO dto) {
        return ResponseEntity.ok(usuarioService.atualizarUsuario(id, dto));
    }

    @PatchMapping("/perfil")
    @Operation(summary = "Atualiza os dados do próprio perfil")
    @ApiResponse(responseCode = "200", description = "Perfil atualizado com sucesso")
    public ResponseEntity<UsuarioResponseDTO> atualizarSelf(@Valid @RequestBody UsuarioSelfUpdateDTO dto) {
        return ResponseEntity.ok(usuarioService.atualizarSelf(dto));
    }

    @PatchMapping(value = "/perfil/foto", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Atualiza a foto de perfil do usuário autenticado")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Foto atualizada com sucesso"),
            @ApiResponse(responseCode = "400", description = "Arquivo inválido")
    })
    public ResponseEntity<UsuarioResponseDTO> atualizarFotoPerfil(
            @RequestParam("foto") MultipartFile foto) {
        return ResponseEntity.ok(usuarioService.atualizarFotoPerfil(foto));
    }

    @PatchMapping("/{id}/desativar")
    @Operation(summary = "Desativa um usuário (ADM)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Usuário desativado"),
            @ApiResponse(responseCode = "403", description = "Permissão negada"),
            @ApiResponse(responseCode = "404", description = "Usuário não encontrado")
    })
    public ResponseEntity<UsuarioResponseDTO> desativarUsuario(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.desativarUsuario(id));
    }

    @PatchMapping("/{id}/ativar")
    @Operation(summary = "Ativa um usuário (ADM)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Usuário ativado"),
            @ApiResponse(responseCode = "403", description = "Permissão negada"),
            @ApiResponse(responseCode = "404", description = "Usuário não encontrado")
    })
    public ResponseEntity<UsuarioResponseDTO> ativarUsuario(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.ativarUsuario(id));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Exclui permanentemente um usuário inativo (ADM)")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Usuário excluído com sucesso"),
            @ApiResponse(responseCode = "400", description = "Usuário ainda está ativo ou possui vínculos"),
            @ApiResponse(responseCode = "403", description = "Permissão negada"),
            @ApiResponse(responseCode = "404", description = "Usuário não encontrado")
    })
    public ResponseEntity<Void> excluirUsuario(@PathVariable Long id) {
        usuarioService.excluirUsuario(id);
        return ResponseEntity.noContent().build();
    }
}
