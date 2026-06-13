# ObservaAção

## 1. Sobre o projeto

ObservaAção é uma plataforma de registro e acompanhamento de solicitações públicas, desenvolvida como projeto acadêmico alinhado ao ODS 16 (Paz, Justiça e Instituições Eficazes). O sistema permite que cidadãos registrem ocorrências e demandas junto ao poder público, enquanto agentes internos gerenciam o ciclo de vida de cada solicitação com transparência e rastreabilidade.

O sistema opera com quatro perfis de usuário:

- **Cidadão**: registra e acompanha suas próprias solicitações.
- **Atendente**: recebe, responde e atualiza o andamento das solicitações.
- **Gestor**: aprova, rejeita e define prioridades para as solicitações.
- **Administrador**: gerencia usuários, categorias, logs de auditoria e controla o anonimato de solicitações.

---

## 2. Tecnologias utilizadas

**Backend**

- Java 21
- Spring Boot 3.4.1 (Web, Security, Data JPA, Validation)
- PostgreSQL 17
- Flyway (migrations e seed automático do banco)
- Spring Security com autenticação JWT (JJWT 0.12.6)
- MapStruct 1.6.3 (mapeamento entre entidades e DTOs)
- Lombok 1.18.36
- SpringDoc OpenAPI / Swagger UI

**Frontend**

- Angular 17.3
- TypeScript 5.4
- Angular Material 17.3
- Leaflet 1.9.4 (mapas interativos)
- Node.js 20+

---

## 3. Pre-requisitos

Instale os itens abaixo antes de executar o projeto:

- JDK 21 — [Adoptium Temurin 21](https://adoptium.net/) ou equivalente
- Maven 3.9+
- Node.js 20+ com npm
- Angular CLI 17: `npm install -g @angular/cli@17`
- PostgreSQL 17

---

## 4. Configuracao do banco de dados

Crie um banco PostgreSQL vazio com o nome de sua preferencia (exemplo: `observa_acao`):

```sql
CREATE DATABASE observa_acao;
```

Nao e necessario executar nenhum script manualmente. Ao iniciar o backend, o Flyway aplica automaticamente todas as migrations em `API/src/main/resources/db/migration/`, criando as tabelas, indices, dados de categoria e o usuario ADM raiz.

---

## 5. Variaveis de ambiente

O backend le as variaveis de ambiente do sistema operacional. Crie o arquivo `API/.env` (ou exporte as variaveis no shell) com o seguinte conteudo:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=observa_acao
DB_USER=postgres
DB_PASSWORD=sua_senha_postgres
JWT_SECRET=ajQwLXYtNGgyZzBmM2cyZ2MtZzItMjM4Y2IzYzAyZWd3
JWT_EXPIRATION=86400000
```

**O que precisa ser ajustado pelo avaliador:**

| Variavel    | O que e                          | Deve trocar?                          |
|-------------|----------------------------------|---------------------------------------|
| DB_HOST     | Host do PostgreSQL               | Somente se nao for localhost          |
| DB_PORT     | Porta do PostgreSQL              | Somente se nao for 5432               |
| DB_NAME     | Nome do banco criado na etapa 4  | Sim, usar o nome que voce escolheu    |
| DB_USER     | Usuario do PostgreSQL            | Sim, usar o seu usuario local         |
| DB_PASSWORD | Senha do usuario do PostgreSQL   | Sim, usar a sua senha local           |
| JWT_SECRET  | Chave de assinatura dos tokens   | Nao (pode usar o valor de exemplo)    |
| JWT_EXPIRATION | Expiracao do token em ms (86400000 = 24 h) | Nao (pode usar como esta) |

Para exportar as variaveis diretamente no shell antes de rodar:

```bash
export DB_HOST=localhost
export DB_PORT=5432
export DB_NAME=observa_acao
export DB_USER=postgres
export DB_PASSWORD=sua_senha_postgres
export JWT_SECRET=ajQwLXYtNGgyZzBmM2cyZ2MtZzItMjM4Y2IzYzAyZWd3
export JWT_EXPIRATION=86400000
```

Alternativamente, configure as variaveis em *Run Configuration → Environment Variables* na sua IDE (IntelliJ IDEA, VS Code, etc.).

---

## 6. Como executar o backend

```bash
# 1. Entre na pasta do backend
cd API

# 2. (Opcional) Se sua maquina tiver multiplas versoes do JDK, aponte para o Java 21
export JAVA_HOME=/caminho/para/jdk-21

# 3. Compile e execute
mvn spring-boot:run
```

A API sobe na porta **8080**.

- Base URL: `http://localhost:8080`
- Swagger UI: `http://localhost:8080/swagger-ui/index.html`
- API docs (JSON): `http://localhost:8080/v3/api-docs`

---

## 7. Como executar o frontend

```bash
# 1. Entre na pasta do frontend
cd APP

# 2. Instale as dependencias
npm install

# 3. Inicie o servidor de desenvolvimento
ng serve
```

O frontend sobe na porta **4200**.

- URL de acesso: `http://localhost:4200`

O frontend esta configurado para se comunicar com o backend em `http://localhost:8080`. Certifique-se de que o backend esta em execucao antes de acessar o sistema.

---

## 8. Credenciais de acesso inicial

Apos a primeira execucao do backend (Flyway aplica todas as migrations), o sistema ja possui um usuario Administrador cadastrado. Use as credenciais abaixo para acessar o sistema com perfil de Administrador:

| Campo | Valor                        |
|-------|------------------------------|
| Email | admin@observaacao.gov.br     |
| Senha | Senha@123                    |

A senha acima foi definida pela migration `V7__update_senha_adm_raiz.sql`, criada especificamente para avaliacao academica. A migration original de seed (`V2__seed_admin.sql`) nao foi alterada.

---

## 9. Funcionalidades principais

**Cidadao**

- Registrar solicitacoes com titulo, descricao, categoria, localizacao (mapa Leaflet) e imagens.
- Acompanhar o historico de status de cada solicitacao.
- Editar perfil e endereco.
- Submeter solicitacoes de forma anonima.

**Atendente**

- Visualizar fila de solicitacoes atribuidas.
- Atualizar o status e adicionar comentarios ao historico.
- Consultar detalhes e imagens das solicitacoes.

**Gestor**

- Aprovar ou rejeitar solicitacoes pendentes.
- Definir prioridade e prazo de atendimento.
- Acompanhar indicadores e metricas do painel.

**Administrador**

- Criar, editar e desativar usuarios de qualquer perfil.
- Gerenciar categorias de solicitacao (criar, editar, ativar/desativar).
- Visualizar logs de auditoria do sistema.
- Controlar o anonimato de solicitacoes.
- Acessar painel consolidado com estatisticas gerais.

---

## 10. Estrutura do projeto

```
Observa-Aep-Pt2/
├── API/                              # Backend Spring Boot
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/unicesumar/observa_acao/
│       │   ├── config/               # Seguranca, CORS, upload
│       │   ├── controller/           # Endpoints REST
│       │   ├── dto/                  # Objetos de transferencia (por dominio)
│       │   ├── enums/                # Enumeracoes de status, perfil, etc.
│       │   ├── exception/            # Tratamento global de erros
│       │   ├── mapper/               # MapStruct (entidade <-> DTO)
│       │   ├── model/                # Entidades JPA
│       │   ├── repository/           # Interfaces Spring Data JPA
│       │   ├── security/             # Filtros JWT, UserDetailsService
│       │   ├── service/              # Logica de negocio
│       │   └── util/                 # Utilitarios gerais
│       └── resources/
│           ├── application.properties
│           └── db/migration/         # Scripts Flyway (V1 a V7)
│
└── APP/                              # Frontend Angular 17
    └── src/app/
        ├── core/                     # Guards, interceptors, services globais
        ├── features/                 # Modulos por funcionalidade
        │   ├── auth/                 # Login e cadastro
        │   ├── dashboard/            # Paineis por perfil (4 variantes)
        │   ├── solicitacoes/         # Listagem, detalhe e nova solicitacao
        │   └── perfil/               # Pagina de perfil do usuario
        └── shared/                   # Componentes e estilos reutilizaveis
```
