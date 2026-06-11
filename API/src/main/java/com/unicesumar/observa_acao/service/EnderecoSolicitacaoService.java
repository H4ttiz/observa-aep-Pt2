package com.unicesumar.observa_acao.service;

import com.unicesumar.observa_acao.dto.endereco.EnderecoSolicitacaoRequestDTO;
import com.unicesumar.observa_acao.dto.endereco.EnderecoSolicitacaoResponseDTO;
import com.unicesumar.observa_acao.exception.NotFoundException;
import com.unicesumar.observa_acao.mapper.EnderecoSolicitacaoMapper;
import com.unicesumar.observa_acao.model.EnderecoSolicitacao;
import com.unicesumar.observa_acao.repository.EnderecoSolicitacaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class EnderecoSolicitacaoService {

    private final EnderecoSolicitacaoRepository repository;
    private final EnderecoSolicitacaoMapper mapper;

    @Transactional(readOnly = true)
    public EnderecoSolicitacaoResponseDTO buscarPorId(Long id) {
        return mapper.toResponseDTO(encontrarPorId(id));
    }

    @Transactional
    public EnderecoSolicitacaoResponseDTO atualizar(Long id, EnderecoSolicitacaoRequestDTO dto) {
        EnderecoSolicitacao entity = encontrarPorId(id);
        entity.setCep(dto.cep().replaceAll("\\D", ""));
        entity.setLogradouro(dto.logradouro().trim());
        entity.setNumero(dto.numero().trim());
        entity.setComplemento(dto.complemento() != null ? dto.complemento().trim() : null);
        entity.setBairro(dto.bairro().trim());
        entity.setCidade(dto.cidade().trim());
        entity.setEstado(dto.estado().toUpperCase().trim());
        return mapper.toResponseDTO(repository.save(entity));
    }

    public EnderecoSolicitacao encontrarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new NotFoundException(
                        "Endereço de solicitação não encontrado com id: " + id));
    }
}
