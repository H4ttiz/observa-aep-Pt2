package com.unicesumar.observa_acao.controller;

import com.unicesumar.observa_acao.dto.endereco.CepResponseDTO;
import com.unicesumar.observa_acao.service.CepService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cep")
@RequiredArgsConstructor
public class CepController {

    private final CepService cepService;

    @GetMapping("/{cep}")
    public ResponseEntity<CepResponseDTO> buscar(@PathVariable String cep) {
        return ResponseEntity.ok(cepService.buscarPorCep(cep));
    }
}
