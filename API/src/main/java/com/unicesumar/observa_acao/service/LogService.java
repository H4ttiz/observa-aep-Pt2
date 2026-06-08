package com.unicesumar.observa_acao.service;

import com.unicesumar.observa_acao.dto.log.LogResponseDTO;
import com.unicesumar.observa_acao.enums.TipoLog;
import com.unicesumar.observa_acao.mapper.LogMapper;
import com.unicesumar.observa_acao.model.Log;
import com.unicesumar.observa_acao.model.Usuario;
import com.unicesumar.observa_acao.repository.LogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class LogService {

    private final LogRepository logRepository;
    private final LogMapper logMapper;

    @Transactional
    public void registrar(TipoLog tipoLog, String descricao, Usuario responsavel) {
        Log log = new Log();
        log.setTipoLog(tipoLog);
        log.setDescricao(descricao);
        log.setUsuario(responsavel);
        log.setDataRegistro(LocalDateTime.now());
        logRepository.save(log);
    }

    public Page<LogResponseDTO> listarTodos(Pageable pageable) {
        if (pageable.getPageSize() > 100) {
            pageable = PageRequest.of(pageable.getPageNumber(), 20, pageable.getSort());
        }
        return logRepository.findAll(pageable).map(logMapper::toResponseDTO);
    }

    public Page<LogResponseDTO> listarPorTipo(TipoLog tipo, Pageable pageable) {
        if (pageable.getPageSize() > 100) {
            pageable = PageRequest.of(pageable.getPageNumber(), 20, pageable.getSort());
        }
        return logRepository.findByTipoLog(tipo, pageable).map(logMapper::toResponseDTO);
    }
}
