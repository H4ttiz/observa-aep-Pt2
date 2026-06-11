package com.unicesumar.observa_acao.client;

import com.unicesumar.observa_acao.dto.endereco.ViaCepResponseDTO;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.util.Optional;

@Component
public class ViaCepClient {

    private final RestClient restClient;

    public ViaCepClient() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(5000);
        factory.setReadTimeout(5000);

        this.restClient = RestClient.builder()
                .baseUrl("https://viacep.com.br")
                .requestFactory(factory)
                .build();
    }

    public Optional<ViaCepResponseDTO> buscar(String cep) {
        try {
            ViaCepResponseDTO response = restClient.get()
                    .uri("/ws/{cep}/json/", cep)
                    .retrieve()
                    .body(ViaCepResponseDTO.class);

            if (response == null || Boolean.TRUE.equals(response.erro())) {
                return Optional.empty();
            }
            return Optional.of(response);
        } catch (RestClientException e) {
            throw new RuntimeException("Erro ao consultar ViaCEP", e);
        }
    }
}
