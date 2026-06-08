package com.unicesumar.observa_acao.repository;

import com.unicesumar.observa_acao.enums.TipoLog;
import com.unicesumar.observa_acao.model.Log;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LogRepository extends JpaRepository<Log, Long> {

    List<Log> findAllByOrderByDataRegistroDesc();

    List<Log> findByTipoLogOrderByDataRegistroDesc(TipoLog tipoLog);
}
