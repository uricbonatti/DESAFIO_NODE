# Rodando o projeto

### Requisitos

- NodeJS LTS
- Docker

### Configurando

Foi utilizado um container do Bando de Dados PostgreSQL para armazenar os dados, para isso é necessario instalar e configurar o mesmo.
Para isto execute o comando a seguir:
`docker run --name api-desafio -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres`

Após a configuração do container docker é necessario subir as migrations do banco.
Para isto execute um dos comandos a seguir:
`yarn typeorm migration:run`
`npm run typeorm migration:run`

Para reverter as migrations é necessario executar 3x um dos comandos a seguir:
`yarn typeorm migration:revert`
`npm run typeorm migration:revert`

Após as migrations terem se completado com sucesso, é hora de iniciar a api. Para isso utilize o um dos comando abaixo:

- Para modo de desenvolvimento com watcher:
  `yarn dev:server`
  `npm run dev:server`

- Para modo de desenvolvimento sem watcher:
  `yarn start`
  `npm start`

- Para compilar para produção (não testado ainda):
  `yarn build`
  `npm run build`

- Para realizar os testes:
  `yarn test`
  `npm run test`

### EndPoints

Os endpoints da rota `cities` são:

- POST: JSON.BODY(`{ "name": "Nome da Cidade", "uf":"Sigla da UF" }`)

- GET: QUERY(`?name="Nome da Cidade"&uf="Sigla da UF"`)

- GET: PARAMS(`:id`) - como uuid

Os endpoints da rota `customers` são:

- POST: JSON.BODY(`{ "fullname":"Nome Completo", "gender":"male ou female", "birthday":"Date no formato: YYYY-MM-DDTHH:mm:ssZ (exemplo: 1992-10-08T16:37:56.447Z)", "city_id": "id tipo uuid da cidade" }`)

- DELETE: PARAMS(`:id`) - como uuid
- GET: PARAMS(`:id`) - como uuid
- PATCH: PARAMS(`:id`) e JSON.BODY(`"fullname":"Novo nome do cliente"`)
- GET: QUERY(`?name="trecho do nome do cliente`)
