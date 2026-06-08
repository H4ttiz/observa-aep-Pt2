ALTER TABLE usuarios
    ADD COLUMN criado_por BIGINT NULL;

ALTER TABLE usuarios
    ADD CONSTRAINT fk_usuario_criado_por
        FOREIGN KEY (criado_por)
            REFERENCES usuarios(id);
