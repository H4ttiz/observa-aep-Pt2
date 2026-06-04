package com.unicesumar.observa_acao.service;

import com.unicesumar.observa_acao.dto.categoria.CategoriaRequestDTO;
import com.unicesumar.observa_acao.dto.categoria.CategoriaResponseDTO;
import com.unicesumar.observa_acao.mapper.CategoriaMapper;
import com.unicesumar.observa_acao.model.Categoria;
import com.unicesumar.observa_acao.repository.CategoriaRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoriaService {

    private final CategoriaRepository repository;
    private final CategoriaMapper mapper;

    @Transactional
    public CategoriaResponseDTO criar(CategoriaRequestDTO dto) {
        if (repository.existsByNome(dto.getNome())) {
            throw new IllegalArgumentException(
                    "Já existe uma categoria com o nome: " + dto.getNome());
        }
        Categoria entity = mapper.toEntity(dto);
        return mapper.toResponseDTO(repository.save(entity));
    }

    @Transactional(readOnly = true)
    public CategoriaResponseDTO buscarPorId(Long id) {
        return mapper.toResponseDTO(encontrarPorId(id));
    }

    @Transactional(readOnly = true)
    public List<CategoriaResponseDTO> listarTodos() {
        return repository.findAll()
                .stream()
                .map(mapper::toResponseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<CategoriaResponseDTO> listarAtivas() {
        return repository.findAllByAtivaTrue()
                .stream()
                .map(mapper::toResponseDTO)
                .toList();
    }

    @Transactional
    public CategoriaResponseDTO atualizar(Long id, CategoriaRequestDTO dto) {
        Categoria entity = encontrarPorId(id);

        if (!entity.getNome().equals(dto.getNome()) && repository.existsByNome(dto.getNome())) {
            throw new IllegalArgumentException(
                    "Já existe uma categoria com o nome: " + dto.getNome());
        }

        mapper.updateEntityFromDTO(dto, entity);
        return mapper.toResponseDTO(repository.save(entity));
    }

    @Transactional
    public void alterarStatus(Long id, Boolean ativa) {
        Categoria entity = encontrarPorId(id);
        entity.setAtiva(ativa);
        repository.save(entity);
    }

    @Transactional
    public void deletar(Long id) {
        encontrarPorId(id);
        repository.deleteById(id);
    }

    public Categoria encontrarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Categoria não encontrada com id: " + id));
    }
}