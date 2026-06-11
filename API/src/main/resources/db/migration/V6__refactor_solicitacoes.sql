-- Passo 1: adicionar solicitacao_id em enderecos_solicitacao (FK inversa, spec 1B)
ALTER TABLE enderecos_solicitacao ADD COLUMN IF NOT EXISTS solicitacao_id BIGINT;

-- Passo 2: popular a partir dos vínculos existentes em solicitacoes
UPDATE enderecos_solicitacao es
SET solicitacao_id = s.id
FROM solicitacoes s
WHERE s.id_endereco = es.id;

-- Passo 3: remover orphans (enderecos sem solicitacao) antes de setar NOT NULL
DELETE FROM enderecos_solicitacao WHERE solicitacao_id IS NULL;

-- Passo 4: adicionar FK, UNIQUE e NOT NULL
ALTER TABLE enderecos_solicitacao
    ALTER COLUMN solicitacao_id SET NOT NULL;

ALTER TABLE enderecos_solicitacao
    ADD CONSTRAINT fk_endereco_sol
        FOREIGN KEY (solicitacao_id) REFERENCES solicitacoes(id) ON DELETE CASCADE;

ALTER TABLE enderecos_solicitacao
    ADD CONSTRAINT uq_endereco_sol UNIQUE (solicitacao_id);

-- Passo 5: remover coluna id_endereco de solicitacoes (FK é dropada automaticamente pelo PostgreSQL)
ALTER TABLE solicitacoes DROP COLUMN IF EXISTS id_endereco;

-- Passo 6: adicionar coluna anonima
ALTER TABLE solicitacoes ADD COLUMN IF NOT EXISTS anonima BOOLEAN NOT NULL DEFAULT FALSE;

-- Passo 7: tornar descricao NOT NULL (era nullable na V1)
ALTER TABLE solicitacoes ALTER COLUMN descricao SET NOT NULL;

-- Passo 8: tornar comentario nullable em historico_solicitacoes
ALTER TABLE historico_solicitacoes ALTER COLUMN comentario DROP NOT NULL;
