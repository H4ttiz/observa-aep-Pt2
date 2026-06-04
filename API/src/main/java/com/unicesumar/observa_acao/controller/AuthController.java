package com.unicesumar.observa_acao.controller;

import com.unicesumar.observa_acao.dto.auth.CidadaoRequestDTO;
import com.unicesumar.observa_acao.dto.auth.LoginRequestDTO;
import com.unicesumar.observa_acao.dto.auth.LoginResponseDTO;
import com.unicesumar.observa_acao.dto.auth.RefreshTokenRequestDTO;
import com.unicesumar.observa_acao.dto.usuario.UsuarioResponseDTO;
import com.unicesumar.observa_acao.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Autenticação", description = "Endpoints de login, refresh, logout e cadastro público")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Realiza login e retorna os tokens de acesso")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Login realizado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos"),
            @ApiResponse(responseCode = "401", description = "Credenciais incorretas")
    })
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO dto) {
        return ResponseEntity.ok(authService.login(dto));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Renova o access token a partir de um refresh token válido")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Token renovado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Refresh token inválido, expirado ou revogado")
    })
    public ResponseEntity<LoginResponseDTO> refresh(@Valid @RequestBody RefreshTokenRequestDTO dto) {
        return ResponseEntity.ok(authService.refreshToken(dto));
    }

    @PostMapping("/logout")
    @Operation(summary = "Encerra a sessão e invalida todos os refresh tokens do usuário")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Logout realizado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Refresh token inválido")
    })
    public ResponseEntity<Void> logout(@Valid @RequestBody RefreshTokenRequestDTO dto) {
        authService.logout(dto);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/cadastro")
    @Operation(summary = "Cadastro público de cidadão")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Usuário cadastrado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos, CPF inválido ou já cadastrado"),
            @ApiResponse(responseCode = "400", description = "Email já cadastrado")
    })
    public ResponseEntity<UsuarioResponseDTO> cadastrar(@Valid @RequestBody CidadaoRequestDTO dto) {
        UsuarioResponseDTO response = authService.cadastrarCidadao(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
