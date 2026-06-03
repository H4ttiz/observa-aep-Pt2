# ObservaAção

Plataforma de registro e acompanhamento de solicitações públicas.

## Pré-requisitos

- Java 21
- Node 20+
- PostgreSQL 17
- Maven 3.9+

## Configuração do ambiente

Copie o arquivo `.env.example` para `.env` e ajuste as variáveis:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=observaacao
DB_USER=postgres
DB_PASSWORD=sua_senha
JWT_SECRET=seu_secret
JWT_EXPIRATION=86400000
```

> O Spring Boot lê variáveis de ambiente do sistema operacional. Exporte-as no shell antes de iniciar:
>
> ```bash
> export DB_HOST=localhost
> export DB_PASSWORD=sua_senha
> # ... demais variáveis
> ```
>
> Ou configure em *Run Configuration → Environment Variables* na sua IDE.

## Rodando o Backend

> **Atenção:** O projeto requer Java 21. Se sua máquina tiver Java 25+ como JDK padrão, aponte o `JAVA_HOME` para o Java 21 antes de rodar:
>
> ```bash
> export JAVA_HOME=/Users/leonardobezerradasilva/Library/Java/JavaVirtualMachines/ms-21.0.11/Contents/Home
> ```

```bash
cd API
mvn spring-boot:run
```

API disponível em: `http://localhost:8080`
Swagger UI: `http://localhost:8080/swagger-ui/index.html`

## Rodando o Frontend

```bash
cd APP
npm install
ng serve
```

App disponível em: `http://localhost:4200`
