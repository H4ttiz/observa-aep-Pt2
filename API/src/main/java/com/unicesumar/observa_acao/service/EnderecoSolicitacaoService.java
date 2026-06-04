package com.unicesumar.observa_acao.service;

import com.unicesumar.observa_acao.dto.endereco.EnderecoSolicitacaoRequestDTO;
import com.unicesumar.observa_acao.dto.endereco.EnderecoSolicitacaoResponseDTO;
import com.unicesumar.observa_acao.mapper.EnderecoSolicitacaoMapper;
import com.unicesumar.observa_acao.model.EnderecoSolicitacao;
import com.unicesumar.observa_acao.repository.EnderecoSolicitacaoRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EnderecoSolicitacaoService {

    private final EnderecoSolicitacaoRepository repository;
    private final EnderecoSolicitacaoMapper mapper;

    @Transactional
    public EnderecoSolicitacaoResponseDTO criar(EnderecoSolicitacaoRequestDTO dto) {
        EnderecoSolicitacao entity = mapper.toEntity(dto);
        return mapper.toResponseDTO(repository.save(entity));
    }

    @Transactional(readOnly = true)
    public EnderecoSolicitacaoResponseDTO buscarPorId(Long id) {
        return mapper.toResponseDTO(encontrarPorId(id));
    }

    @Transactional(readOnly = true)
    public List<EnderecoSolicitacaoResponseDTO> listarTodos() {
        return repository.findAll()
                .stream()
                .map(mapper::toResponseDTO)
                .toList();
    }

    @Transactional
    public EnderecoSolicitacaoResponseDTO atualizar(Long id, EnderecoSolicitacaoRequestDTO dto) {
        EnderecoSolicitacao entity = encontrarPorId(id);
        mapper.updateEntityFromDTO(dto, entity);
        return mapper.toResponseDTO(repository.save(entity));
    }

    @Transactional
    public void deletar(Long id) {
        encontrarPorId(id);
        repository.deleteById(id);
    }

    public EnderecoSolicitacao encontrarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Endereço de solicitação não encontrado com id: " + id));
    }
}
