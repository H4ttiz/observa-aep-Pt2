package com.unicesumar.observa_acao.util;

import com.unicesumar.observa_acao.enums.TipoLog;
import com.unicesumar.observa_acao.model.Log;
import com.unicesumar.observa_acao.model.Usuario;
import com.unicesumar.observa_acao.repository.LogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class LogUtil {

    private final LogRepository logRepository;

    public void registrar(TipoLog tipoLog, String descricao, Usuario usuario) {
        registrar(tipoLog, descricao, usuario, null);
    }

    public void registrar(TipoLog tipoLog, String descricao, Usuario usuario, String ip) {
        Log log = new Log();
        log.setTipoLog(tipoLog);
        log.setDescricao(descricao);
        log.setUsuario(usuario);
        log.setDataRegistro(LocalDateTime.now());
        log.setIpAddress(ip);
        logRepository.save(log);
    }
}
