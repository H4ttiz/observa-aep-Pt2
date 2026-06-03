-- ADM raiz (senha: "admin123" em BCrypt — trocar antes de produção)
INSERT INTO usuarios (nome, email, senha, tipo_usuario)
VALUES (
    'Administrador',
    'admin@observaacao.gov.br',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'ADMINISTRADOR'
);
