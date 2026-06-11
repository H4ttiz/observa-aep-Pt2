package com.unicesumar.observa_acao.model;

import com.unicesumar.observa_acao.enums.NivelPrioridade;
import com.unicesumar.observa_acao.enums.StatusSolicitacao;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "solicitacoes")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Solicitacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String descricao;

    @Column(nullable = false)
    private Boolean anonima = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusSolicitacao status;

    @Enumerated(EnumType.STRING)
    private NivelPrioridade prioridade;

    @Column(name = "data_abertura", nullable = false)
    private LocalDateTime dataAbertura;

    @Column(name = "data_prazo")
    private LocalDateTime dataPrazo;

    @Column(name = "data_finalizacao")
    private LocalDateTime dataFinalizacao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_solicitante")
    private Usuario solicitante;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_atendente")
    private Usuario atendente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_categoria", nullable = false)
    private Categoria categoria;

    @OneToOne(mappedBy = "solicitacao", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private EnderecoSolicitacao enderecoSolicitacao;

    @OneToMany(mappedBy = "solicitacao", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("dataUpload ASC")
    private List<ImagemSolicitacao> imagens = new ArrayList<>();

    @OneToMany(mappedBy = "solicitacao", cascade = CascadeType.ALL)
    @OrderBy("dataAlteracao ASC")
    private List<HistoricoSolicitacao> historicos = new ArrayList<>();
}
