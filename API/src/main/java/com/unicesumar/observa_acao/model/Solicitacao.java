package com.unicesumar.observa_acao.model;

import com.unicesumar.observa_acao.enums.NivelPrioridade;
import com.unicesumar.observa_acao.enums.StatusSolicitacao;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "solicitacoes")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Solicitacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    private String descricao;

    @ManyToOne
    @JoinColumn(name = "id_solicitante")
    private Usuario solicitante;

    @ManyToOne
    @JoinColumn(name = "id_categoria", nullable = false)
    private Categoria categoria;

    @OneToOne
    @JoinColumn(name = "id_endereco", nullable = false)
    private EnderecoSolicitacao endereco;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusSolicitacao status;

    @Enumerated(EnumType.STRING)
    private NivelPrioridade prioridade;

    @ManyToOne
    @JoinColumn(name = "id_atendente")
    private Usuario atendente;

    @Column(name = "data_abertura", nullable = false)
    private LocalDateTime dataAbertura;

    @Column(name = "data_prazo")
    private LocalDateTime dataPrazo;

    @Column(name = "data_finalizacao")
    private LocalDateTime dataFinalizacao;
}
