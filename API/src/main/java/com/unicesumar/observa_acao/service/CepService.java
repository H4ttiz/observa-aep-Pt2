package com.unicesumar.observa_acao.service;

import com.unicesumar.observa_acao.client.ViaCepClient;
import com.unicesumar.observa_acao.dto.endereco.CepResponseDTO;
import com.unicesumar.observa_acao.dto.endereco.ViaCepResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class CepService {

    private final ViaCepClient viaCepClient;

    public CepResponseDTO buscarPorCep(String cep) {
        String digits = cep.replaceAll("\\D", "");
        if (digits.length() != 8) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "CEP inválido");
        }

        ViaCepResponseDTO via = viaCepClient.buscar(digits)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "CEP não encontrado"));

        return new CepResponseDTO(
                via.cep(),
                via.logradouro(),
                via.complemento(),
                via.bairro(),
                via.localidade(),
                via.uf()
        );
    }
}
