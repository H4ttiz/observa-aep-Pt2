-- Atualiza a senha do ADM raiz para fins de avaliacao academica.
-- Senha em texto plano: Senha@123
-- Hash BCrypt (fator 10): $2a$10$GOdUhU.R4csdfpF.CanP0.iFNsVgqLrICSVvzmZpH3K5cAwXbFTiW
UPDATE usuarios
SET senha = '$2a$10$GOdUhU.R4csdfpF.CanP0.iFNsVgqLrICSVvzmZpH3K5cAwXbFTiW'
WHERE email = 'admin@observaacao.gov.br'
  AND tipo_usuario = 'ADMINISTRADOR'
  AND criado_por IS NULL;
