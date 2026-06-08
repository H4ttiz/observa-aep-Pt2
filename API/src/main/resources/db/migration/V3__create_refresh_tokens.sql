CREATE TABLE refresh_tokens (
    id           BIGSERIAL    PRIMARY KEY,
    token        VARCHAR(255) NOT NULL UNIQUE,
    usuario_id   BIGINT       NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    expiracao_at TIMESTAMP    NOT NULL,
    revogado     BOOLEAN      NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_refresh_tokens_usuario_id ON refresh_tokens(usuario_id);
