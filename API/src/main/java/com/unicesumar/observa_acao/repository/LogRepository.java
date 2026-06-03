package com.unicesumar.observa_acao.repository;

import com.unicesumar.observa_acao.model.Log;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LogRepository extends JpaRepository<Log, Long> {
}
