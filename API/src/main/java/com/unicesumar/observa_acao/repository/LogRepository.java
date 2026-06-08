package com.unicesumar.observa_acao.repository;

import com.unicesumar.observa_acao.enums.TipoLog;
import com.unicesumar.observa_acao.model.Log;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LogRepository extends JpaRepository<Log, Long> {

    Page<Log> findByTipoLog(TipoLog tipoLog, Pageable pageable);
}
