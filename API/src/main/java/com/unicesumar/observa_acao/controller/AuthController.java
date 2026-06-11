package com.unicesumar.observa_acao.controller;

import com.unicesumar.observa_acao.dto.auth.CidadaoRequestDTO;
import com.unicesumar.observa_acao.dto.auth.LoginRequestDTO;
import com.unicesumar.observa_acao.dto.auth.LoginResponseDTO;
import com.unicesumar.observa_acao.dto.auth.RefreshTokenRequestDTO;
import com.unicesumar.observa_acao.dto.usuario.UsuarioResponseDTO;
import com.unicesumar.observa_acao.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO dto) {
        return ResponseEntity.ok(authService.login(dto));
    }

    @PostMapping("/refresh")
    public ResponseEntity<LoginResponseDTO> refresh(@Valid @RequestBody RefreshTokenRequestDTO dto) {
        return ResponseEntity.ok(authService.refreshToken(dto));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@Valid @RequestBody RefreshTokenRequestDTO dto) {
        authService.logout(dto);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/cadastro")
    public ResponseEntity<UsuarioResponseDTO> cadastrar(@Valid @RequestBody CidadaoRequestDTO dto) {
        UsuarioResponseDTO response = authService.cadastrarCidadao(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
