package com.unicesumar.observa_acao.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "imagens_solicitacao")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ImagemSolicitacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_solicitacao", nullable = false)
    private Solicitacao solicitacao;

    @Column(nullable = false)
    private String url;

    @Column(name = "data_upload", nullable = false)
    private LocalDateTime dataUpload;
}
