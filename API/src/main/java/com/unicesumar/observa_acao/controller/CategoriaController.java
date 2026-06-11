package com.unicesumar.observa_acao.controller;

import com.unicesumar.observa_acao.dto.categoria.CategoriaRequestDTO;
import com.unicesumar.observa_acao.dto.categoria.CategoriaResponseDTO;
import com.unicesumar.observa_acao.service.CategoriaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/categorias")
@RequiredArgsConstructor
public class CategoriaController {

    private final CategoriaService categoriaService;

    @PostMapping
    public ResponseEntity<CategoriaResponseDTO> criar(@Valid @RequestBody CategoriaRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(categoriaService.criar(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoriaResponseDTO> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody CategoriaRequestDTO dto) {
        return ResponseEntity.ok(categoriaService.atualizar(id, dto));
    }

    @PatchMapping("/{id}/ativar")
    public ResponseEntity<CategoriaResponseDTO> ativar(@PathVariable Long id) {
        return ResponseEntity.ok(categoriaService.ativar(id));
    }

    @PatchMapping("/{id}/desativar")
    public ResponseEntity<CategoriaResponseDTO> desativar(@PathVariable Long id) {
        return ResponseEntity.ok(categoriaService.desativar(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        categoriaService.excluir(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<Page<CategoriaResponseDTO>> listarTodas(
            @RequestParam(required = false) Boolean ativo,
            @PageableDefault(size = 20, sort = "nome", direction = Sort.Direction.ASC) Pageable pageable) {
        return ResponseEntity.ok(categoriaService.listarTodas(ativo, pageable));
    }

    @GetMapping("/ativas")
    public ResponseEntity<Page<CategoriaResponseDTO>> listarAtivas(
            @PageableDefault(size = 20, sort = "nome", direction = Sort.Direction.ASC) Pageable pageable) {
        return ResponseEntity.ok(categoriaService.listarAtivas(pageable));
    }
}
