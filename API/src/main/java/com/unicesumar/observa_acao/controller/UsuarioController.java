package com.unicesumar.observa_acao.controller;

import com.unicesumar.observa_acao.dto.usuario.UsuarioRequestDTO;
import com.unicesumar.observa_acao.dto.usuario.UsuarioResponseDTO;
import com.unicesumar.observa_acao.dto.usuario.UsuarioSelfUpdateDTO;
import com.unicesumar.observa_acao.dto.usuario.UsuarioUpdateDTO;
import com.unicesumar.observa_acao.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @GetMapping
    public ResponseEntity<Page<UsuarioResponseDTO>> listarTodos(
            @PageableDefault(size = 20, sort = "nome", direction = Sort.Direction.ASC) Pageable pageable) {
        return ResponseEntity.ok(usuarioService.listarTodos(pageable));
    }

    @GetMapping("/perfil")
    public ResponseEntity<UsuarioResponseDTO> buscarPerfil() {
        return ResponseEntity.ok(usuarioService.buscarPerfil());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<UsuarioResponseDTO> criarUsuario(@Valid @RequestBody UsuarioRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioService.criarUsuario(dto));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> atualizarUsuario(
            @PathVariable Long id,
            @Valid @RequestBody UsuarioUpdateDTO dto) {
        return ResponseEntity.ok(usuarioService.atualizarUsuario(id, dto));
    }

    @PatchMapping("/perfil")
    public ResponseEntity<UsuarioResponseDTO> atualizarSelf(@Valid @RequestBody UsuarioSelfUpdateDTO dto) {
        return ResponseEntity.ok(usuarioService.atualizarSelf(dto));
    }

    @PatchMapping(value = "/perfil/foto", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UsuarioResponseDTO> atualizarFotoPerfil(
            @RequestParam("foto") MultipartFile foto) {
        return ResponseEntity.ok(usuarioService.atualizarFotoPerfil(foto));
    }

    @PatchMapping("/{id}/desativar")
    public ResponseEntity<UsuarioResponseDTO> desativarUsuario(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.desativarUsuario(id));
    }

    @PatchMapping("/{id}/ativar")
    public ResponseEntity<UsuarioResponseDTO> ativarUsuario(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.ativarUsuario(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluirUsuario(@PathVariable Long id) {
        usuarioService.excluirUsuario(id);
        return ResponseEntity.noContent().build();
    }
}
