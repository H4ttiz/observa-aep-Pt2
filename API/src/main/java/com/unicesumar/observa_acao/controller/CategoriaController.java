package com.unicesumar.observa_acao.controller;

import com.unicesumar.observa_acao.dto.categoria.CategoriaRequestDTO;
import com.unicesumar.observa_acao.dto.categoria.CategoriaResponseDTO;
import com.unicesumar.observa_acao.service.CategoriaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Categorias", description = "Gerenciamento de categorias")
public class CategoriaController {

    private final CategoriaService categoriaService;

    @PostMapping
    @Operation(summary = "Cria uma nova categoria (ADM)")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Categoria criada com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos ou nome já cadastrado"),
            @ApiResponse(responseCode = "403", description = "Acesso negado")
    })
    public ResponseEntity<CategoriaResponseDTO> criar(@Valid @RequestBody CategoriaRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(categoriaService.criar(dto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualiza nome e descrição de uma categoria (ADM)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Categoria atualizada"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos ou nome duplicado"),
            @ApiResponse(responseCode = "404", description = "Categoria não encontrada")
    })
    public ResponseEntity<CategoriaResponseDTO> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody CategoriaRequestDTO dto) {
        return ResponseEntity.ok(categoriaService.atualizar(id, dto));
    }

    @PatchMapping("/{id}/ativar")
    @Operation(summary = "Ativa uma categoria inativa (ADM)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Categoria ativada"),
            @ApiResponse(responseCode = "400", description = "Categoria já está ativa"),
            @ApiResponse(responseCode = "404", description = "Categoria não encontrada")
    })
    public ResponseEntity<CategoriaResponseDTO> ativar(@PathVariable Long id) {
        return ResponseEntity.ok(categoriaService.ativar(id));
    }

    @PatchMapping("/{id}/desativar")
    @Operation(summary = "Desativa uma categoria ativa (ADM)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Categoria desativada"),
            @ApiResponse(responseCode = "400", description = "Categoria já inativa ou com solicitações ativas"),
            @ApiResponse(responseCode = "404", description = "Categoria não encontrada")
    })
    public ResponseEntity<CategoriaResponseDTO> desativar(@PathVariable Long id) {
        return ResponseEntity.ok(categoriaService.desativar(id));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Exclui permanentemente uma categoria inativa sem vínculos (ADM)")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Categoria excluída"),
            @ApiResponse(responseCode = "400", description = "Categoria ativa ou com solicitações vinculadas"),
            @ApiResponse(responseCode = "404", description = "Categoria não encontrada")
    })
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        categoriaService.excluir(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    @Operation(summary = "Lista todas as categorias com paginação (ADM). Filtro opcional: ?ativo=true ou ?ativo=false")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Página retornada com sucesso"),
            @ApiResponse(responseCode = "403", description = "Acesso negado")
    })
    public ResponseEntity<Page<CategoriaResponseDTO>> listarTodas(
            @RequestParam(required = false) Boolean ativo,
            @PageableDefault(size = 20, sort = "nome", direction = Sort.Direction.ASC) Pageable pageable) {
        return ResponseEntity.ok(categoriaService.listarTodas(ativo, pageable));
    }

    @GetMapping("/ativas")
    @Operation(summary = "Lista apenas categorias ativas — rota pública para selects. Para trazer todas de uma vez use ?size=100")
    @ApiResponse(responseCode = "200", description = "Categorias ativas retornadas")
    public ResponseEntity<Page<CategoriaResponseDTO>> listarAtivas(
            @PageableDefault(size = 20, sort = "nome", direction = Sort.Direction.ASC) Pageable pageable) {
        return ResponseEntity.ok(categoriaService.listarAtivas(pageable));
    }
}
