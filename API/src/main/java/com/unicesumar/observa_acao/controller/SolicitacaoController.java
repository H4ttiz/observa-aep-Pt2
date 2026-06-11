package com.unicesumar.observa_acao.controller;

import com.unicesumar.observa_acao.dto.imagem.ImagemSolicitacaoResponseDTO;
import com.unicesumar.observa_acao.dto.solicitacao.*;
import com.unicesumar.observa_acao.service.SolicitacaoService;
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
@RequestMapping("/api/solicitacoes")
@RequiredArgsConstructor
public class SolicitacaoController {

    private final SolicitacaoService service;

    @PostMapping
    public ResponseEntity<SolicitacaoResponseDTO> criar(@Valid @RequestBody SolicitacaoRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.criar(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SolicitacaoResponseDTO> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody SolicitacaoUpdateDTO dto) {
        return ResponseEntity.ok(service.atualizar(id, dto));
    }

    @GetMapping("/minhas")
    public ResponseEntity<Page<SolicitacaoResponseDTO>> minhas(
            @PageableDefault(size = 20, sort = "dataAbertura", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(service.minhas(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SolicitacaoResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PatchMapping("/{id}/aprovar")
    public ResponseEntity<SolicitacaoResponseDTO> aprovar(
            @PathVariable Long id,
            @Valid @RequestBody GestorAprovarDTO dto) {
        return ResponseEntity.ok(service.aprovar(id, dto));
    }

    @PatchMapping("/{id}/rejeitar")
    public ResponseEntity<SolicitacaoResponseDTO> rejeitar(
            @PathVariable Long id,
            @Valid @RequestBody GestorRejeitarDTO dto) {
        return ResponseEntity.ok(service.rejeitar(id, dto));
    }

    @PatchMapping("/{id}/reativar")
    public ResponseEntity<SolicitacaoResponseDTO> reativar(@PathVariable Long id) {
        return ResponseEntity.ok(service.reativar(id));
    }

    @GetMapping("/aguardando-aprovacao")
    public ResponseEntity<Page<SolicitacaoResponseDTO>> aguardandoAprovacao(
            @PageableDefault(size = 20, sort = "dataAbertura", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(service.aguardandoAprovacao(pageable));
    }

    @GetMapping("/rejeitadas")
    public ResponseEntity<Page<SolicitacaoResponseDTO>> rejeitadas(
            @PageableDefault(size = 20, sort = "dataAbertura", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(service.rejeitadas(pageable));
    }

    @GetMapping("/finalizadas")
    public ResponseEntity<Page<SolicitacaoResponseDTO>> finalizadas(
            @PageableDefault(size = 20, sort = "dataAbertura", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(service.finalizadas(pageable));
    }

    @GetMapping("/em-andamento")
    public ResponseEntity<Page<SolicitacaoResponseDTO>> emAndamento(
            @PageableDefault(size = 20, sort = "dataAbertura", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(service.emAndamento(pageable));
    }

    @PatchMapping("/{id}/pegar")
    public ResponseEntity<SolicitacaoResponseDTO> pegar(@PathVariable Long id) {
        return ResponseEntity.ok(service.pegar(id));
    }

    @PatchMapping("/{id}/finalizar")
    public ResponseEntity<SolicitacaoResponseDTO> finalizar(@PathVariable Long id) {
        return ResponseEntity.ok(service.finalizar(id));
    }

    @PatchMapping("/{id}/desvincular")
    public ResponseEntity<SolicitacaoResponseDTO> desvincular(@PathVariable Long id) {
        return ResponseEntity.ok(service.desvincular(id));
    }

    @PatchMapping("/{id}/reabrir")
    public ResponseEntity<SolicitacaoResponseDTO> reabrir(@PathVariable Long id) {
        return ResponseEntity.ok(service.reabrir(id));
    }

    @GetMapping("/fila")
    public ResponseEntity<Page<SolicitacaoResponseDTO>> fila(
            @PageableDefault(size = 20, sort = "dataAbertura", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(service.fila(pageable));
    }

    @GetMapping("/finalizadas-por-mim")
    public ResponseEntity<Page<SolicitacaoResponseDTO>> finalizadasPorMim(
            @PageableDefault(size = 20, sort = "dataAbertura", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(service.finalizadasPorMim(pageable));
    }

    @GetMapping
    public ResponseEntity<Page<SolicitacaoResponseDTO>> listarTodas(
            @PageableDefault(size = 20, sort = "dataAbertura", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(service.listarTodas(pageable));
    }

    @PatchMapping("/{id}/revelar-anonimato")
    public ResponseEntity<SolicitacaoResponseDTO> revelarAnonimato(
            @PathVariable Long id,
            @Valid @RequestBody RevealAnonimatoDTO dto) {
        return ResponseEntity.ok(service.revelarAnonimato(id, dto));
    }

    @PatchMapping("/{id}/vincular-atendente")
    public ResponseEntity<SolicitacaoResponseDTO> vincularAtendente(
            @PathVariable Long id,
            @Valid @RequestBody VincularAtendenteDTO dto) {
        return ResponseEntity.ok(service.vincularAtendente(id, dto));
    }

    @PatchMapping("/{id}/admin-update")
    public ResponseEntity<SolicitacaoResponseDTO> admUpdate(
            @PathVariable Long id,
            @Valid @RequestBody SolicitacaoAdmUpdateDTO dto) {
        return ResponseEntity.ok(service.admUpdate(id, dto));
    }

    @PostMapping(value = "/{id}/imagens", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ImagemSolicitacaoResponseDTO> adicionarImagem(
            @PathVariable Long id,
            @RequestParam("arquivo") MultipartFile arquivo) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.adicionarImagem(id, arquivo));
    }

    @DeleteMapping("/{id}/imagens/{imgId}")
    public ResponseEntity<Void> removerImagem(@PathVariable Long id, @PathVariable Long imgId) {
        service.removerImagem(id, imgId);
        return ResponseEntity.noContent().build();
    }
}
