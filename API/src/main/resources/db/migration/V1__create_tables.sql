-- Usuários
CREATE TABLE usuarios (
    id           BIGSERIAL PRIMARY KEY,
    nome         VARCHAR(255) NOT NULL,
    email        VARCHAR(255) NOT NULL UNIQUE,
    senha        VARCHAR(255) NOT NULL,
    cpf          VARCHAR(14)  UNIQUE,
    celular      VARCHAR(20),
    foto_perfil  VARCHAR(500),
    tipo_usuario VARCHAR(30)  NOT NULL,
    data_criacao TIMESTAMP    NOT NULL DEFAULT NOW(),
    ativo        BOOLEAN      NOT NULL DEFAULT TRUE
);

-- Endereços dos usuários (1 por usuário, opcional)
CREATE TABLE enderecos_usuario (
    id          BIGSERIAL PRIMARY KEY,
    id_usuario  BIGINT NOT NULL UNIQUE REFERENCES usuarios(id) ON DELETE CASCADE,
    logradouro  VARCHAR(255) NOT NULL,
    numero      VARCHAR(20),
    complemento VARCHAR(100),
    bairro      VARCHAR(100) NOT NULL,
    cidade      VARCHAR(100) NOT NULL,
    estado      CHAR(2)      NOT NULL,
    cep         VARCHAR(9)   NOT NULL
);

-- Categorias de solicitação
CREATE TABLE categorias (
    id        BIGSERIAL PRIMARY KEY,
    nome      VARCHAR(100) NOT NULL UNIQUE,
    descricao TEXT,
    ativa     BOOLEAN NOT NULL DEFAULT TRUE
);

-- Endereços das solicitações (obrigatório, mesmo em anônimas)
CREATE TABLE enderecos_solicitacao (
    id          BIGSERIAL PRIMARY KEY,
    logradouro  VARCHAR(255) NOT NULL,
    numero      VARCHAR(20),
    complemento VARCHAR(100),
    bairro      VARCHAR(100) NOT NULL,
    cidade      VARCHAR(100) NOT NULL,
    estado      CHAR(2)      NOT NULL,
    cep         VARCHAR(9)   NOT NULL,
    latitude    DOUBLE PRECISION,
    longitude   DOUBLE PRECISION
);

-- Solicitações
CREATE TABLE solicitacoes (
    id               BIGSERIAL PRIMARY KEY,
    titulo           VARCHAR(255) NOT NULL,
    descricao        TEXT,
    id_solicitante   BIGINT REFERENCES usuarios(id),
    id_categoria     BIGINT NOT NULL REFERENCES categorias(id),
    id_endereco      BIGINT NOT NULL REFERENCES enderecos_solicitacao(id),
    status           VARCHAR(30) NOT NULL DEFAULT 'AGUARDANDO_APROVACAO',
    prioridade       VARCHAR(20),
    id_atendente     BIGINT REFERENCES usuarios(id),
    data_abertura    TIMESTAMP NOT NULL DEFAULT NOW(),
    data_prazo       TIMESTAMP,
    data_finalizacao TIMESTAMP
);

-- Imagens das solicitações (N imagens por solicitação)
CREATE TABLE imagens_solicitacao (
    id             BIGSERIAL PRIMARY KEY,
    id_solicitacao BIGINT       NOT NULL REFERENCES solicitacoes(id) ON DELETE CASCADE,
    url            VARCHAR(500) NOT NULL,
    data_upload    TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- Histórico de mudanças de status
CREATE TABLE historico_solicitacoes (
    id              BIGSERIAL PRIMARY KEY,
    id_solicitacao  BIGINT NOT NULL REFERENCES solicitacoes(id),
    status_anterior VARCHAR(30),
    status_novo     VARCHAR(30) NOT NULL,
    comentario      TEXT NOT NULL,
    id_responsavel  BIGINT REFERENCES usuarios(id),
    data_mudanca    TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Logs de auditoria (visível apenas ao ADM)
CREATE TABLE logs (
    id            BIGSERIAL PRIMARY KEY,
    tipo_log      VARCHAR(30) NOT NULL,
    descricao     TEXT NOT NULL,
    id_usuario    BIGINT REFERENCES usuarios(id),
    data_registro TIMESTAMP NOT NULL DEFAULT NOW(),
    ip_address    VARCHAR(45)
);
