package com.unicesumar.observa_acao.controller;

import com.unicesumar.observa_acao.dto.log.LogResponseDTO;
import com.unicesumar.observa_acao.enums.TipoLog;
import com.unicesumar.observa_acao.service.LogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/logs")
@RequiredArgsConstructor
@Tag(name = "Logs", description = "Endpoints de consulta de logs do sistema (apenas ADMINISTRADOR)")
public class LogController {

    private final LogService logService;

    @GetMapping
    @Operation(summary = "Lista os logs do sistema, com filtro opcional por tipo")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista retornada com sucesso"),
            @ApiResponse(responseCode = "403", description = "Acesso negado")
    })
    public ResponseEntity<List<LogResponseDTO>> listar(
            @RequestParam(required = false) TipoLog tipo) {

        List<LogResponseDTO> resultado = tipo != null
                ? logService.listarPorTipo(tipo)
                : logService.listarTodos();

        return ResponseEntity.ok(resultado);
    }
}
