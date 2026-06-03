package com.unicesumar.observa_acao.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "historico_solicitacoes")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class HistoricoSolicitacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_solicitacao", nullable = false)
    private Solicitacao solicitacao;

    @Column(name = "status_anterior")
    private String statusAnterior;

    @Column(name = "status_novo", nullable = false)
    private String statusNovo;

    @Column(nullable = false)
    private String comentario;

    @ManyToOne
    @JoinColumn(name = "id_responsavel")
    private Usuario responsavel;

    @Column(name = "data_mudanca", nullable = false)
    private LocalDateTime dataMudanca;
}
