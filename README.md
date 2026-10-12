# Desafio Node: Cidades e Clientes

[![CI](https://github.com/uricbonatti/DESAFIO_NODE/actions/workflows/ci.yml/badge.svg)](https://github.com/uricbonatti/DESAFIO_NODE/actions/workflows/ci.yml)
![Node](https://img.shields.io/badge/node-22%20%7C%2024-339933?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![Coverage](https://img.shields.io/badge/coverage-100%25%20services-brightgreen)

API REST de cadastro de **cidades** e **clientes**, feita como desafio técnico da Compasso UOL (2020).

## Destaques técnicos

- **Arquitetura modular** (`cities`, `customers`) com separação entre domínio (services, DTOs, interfaces de repositório) e infraestrutura (HTTP, TypeORM), além de injeção de dependência (`tsyringe`)
- **PostgreSQL + TypeORM 0.3** com **migrations**, aplicadas automaticamente ao subir a API
- **Normalização de nomes** (sem acentos, maiúsculo): buscas ignoram acentos e caixa
- **Idade do cliente calculada** a partir da data de nascimento (`class-transformer` + `date-fns`)
- **Testes:** 22 unitários com repositórios falsos (100% dos services) e **11 e2e com Testcontainers**, que sobem um PostgreSQL real e rodam as migrations num banco limpo

## Executando

### Com Docker Compose

```bash
docker compose up --build
```

A API sobe em `http://localhost:3333` com o PostgreSQL, já com as migrations aplicadas.

### Localmente

Requer Node.js **22** ou **24** e um PostgreSQL.

```bash
cp .env.example .env
docker run -d --name desafio-pg -e POSTGRES_PASSWORD=docker -e POSTGRES_DB=desafio1_compasso -p 5432:5432 postgres:16-alpine
npm ci
npm run dev:server
```

Para gerenciar migrations manualmente: `npm run typeorm migration:run` / `migration:revert`.

## Rotas

| Método | Rota | Descrição |
|---|---|---|
| POST | `/cities` | Cadastra cidade: `{ "name": "Campinas", "uf": "SP" }` |
| GET | `/cities?name=&uf=` | Busca por trecho do nome e/ou UF |
| GET | `/cities/:id` | Mostra a cidade (id uuid) |
| POST | `/customers` | Cadastra cliente: `{ "fullname", "gender": "male"\|"female", "birthday", "city_id" }` |
| GET | `/customers?name=` | Busca por trecho do nome |
| GET | `/customers/:id` | Mostra o cliente com `age` calculada e a cidade |
| PATCH | `/customers/:id` | Renomeia: `{ "fullname": "Novo Nome" }` |
| DELETE | `/customers/:id` | Remove o cliente |

Erros de regra de negócio (cidade repetida, cidade inexistente, nascimento no futuro, registro não encontrado) respondem **400** com `{ "status": "error", "message": "..." }`.

## Testes

```bash
npm test               # unitários (com --coverage gera o relatório em coverage/)
npm run test:e2e       # e2e: sobe um PostgreSQL real com Testcontainers (requer Docker)
npm run lint
npm run typecheck
```

## Licença

MIT
