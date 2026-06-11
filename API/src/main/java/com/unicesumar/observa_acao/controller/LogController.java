package com.unicesumar.observa_acao.controller;

import com.unicesumar.observa_acao.dto.log.LogResponseDTO;
import com.unicesumar.observa_acao.enums.TipoLog;
import com.unicesumar.observa_acao.service.LogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/logs")
@RequiredArgsConstructor
public class LogController {

    private final LogService logService;

    @GetMapping
    public ResponseEntity<Page<LogResponseDTO>> listar(
            @RequestParam(required = false) TipoLog tipo,
            @PageableDefault(size = 20, sort = "dataRegistro", direction = Sort.Direction.DESC) Pageable pageable) {

        return ResponseEntity.ok(tipo != null
                ? logService.listarPorTipo(tipo, pageable)
                : logService.listarTodos(pageable));
    }
}
