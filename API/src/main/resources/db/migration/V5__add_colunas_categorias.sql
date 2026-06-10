-- Renomeia ativa → ativo para alinhar com a entidade Categoria.java
ALTER TABLE categorias RENAME COLUMN ativa TO ativo;

-- descricao existe mas é nullable — entidade define nullable = false
ALTER TABLE categorias ALTER COLUMN descricao SET NOT NULL;

-- Adiciona data_criacao (entidade: @Column(name = "data_criacao", nullable = false))
ALTER TABLE categorias
    ADD COLUMN data_criacao TIMESTAMP NOT NULL DEFAULT NOW();

-- Adiciona criado_por (entidade: @ManyToOne @JoinColumn(name = "criado_por"))
ALTER TABLE categorias
    ADD COLUMN criado_por BIGINT NULL REFERENCES usuarios(id);
