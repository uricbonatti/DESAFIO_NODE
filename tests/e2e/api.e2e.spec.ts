import 'reflect-metadata';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import request from 'supertest';
import type { Express } from 'express';
import type { DataSource } from 'typeorm';

// Fluxo completo: Express real + PostgreSQL real (Testcontainers) com as migrations aplicadas num banco limpo.
jest.setTimeout(180_000);

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

let pg: StartedPostgreSqlContainer;
let dataSource: DataSource;
let app: Express;

beforeAll(async () => {
  pg = await new PostgreSqlContainer('postgres:16-alpine')
    .withDatabase('desafio1_compasso')
    .start();
  process.env.DB_HOST = pg.getHost();
  process.env.DB_PORT = String(pg.getPort());
  process.env.DB_USER = pg.getUsername();
  process.env.DB_PASS = pg.getPassword();
  process.env.DB_NAME = pg.getDatabase();

  // Importa só depois de configurar o ambiente: o DataSource lê as variáveis no import.
  dataSource = (await import('@shared/infra/typeorm')).default;
  await dataSource.initialize(); // migrationsRun: aplica todas as migrations
  app = (await import('@shared/infra/http/app')).default;
});

afterAll(async () => {
  await dataSource?.destroy();
  await pg?.stop();
});

describe('Banco (e2e)', () => {
  it('aplica todas as migrations num Postgres novo, inclusive a extensão uuid-ossp', async () => {
    const [ext] = await dataSource.query(
      "SELECT extname FROM pg_extension WHERE extname = 'uuid-ossp'",
    );
    const tables = await dataSource.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name",
    );

    expect(ext).toEqual({ extname: 'uuid-ossp' });
    expect(tables.map((t: { table_name: string }) => t.table_name)).toEqual(
      expect.arrayContaining(['cities', 'customers', 'migrations']),
    );
  });
});

describe('Cidades (e2e)', () => {
  let cityId: string;

  it('cadastra uma cidade normalizando o nome', async () => {
    const res = await request(app)
      .post('/cities')
      .send({ name: 'Campinas', uf: 'SP' });
    cityId = res.body.id;

    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        id: expect.stringMatching(UUID),
        name: 'CAMPINAS',
        uf: 'SP',
      }),
    );
  });

  it('recusa cidade repetida', async () => {
    const res = await request(app)
      .post('/cities')
      .send({ name: 'Campinas', uf: 'SP' });

    expect(res.status).toBe(400);
  });

  it('busca por trecho do nome e por UF', async () => {
    await request(app).post('/cities').send({ name: 'Curitiba', uf: 'PR' });

    const byName = await request(app).get('/cities').query({ name: 'Camp' });
    const byUf = await request(app).get('/cities').query({ uf: 'PR' });
    const both = await request(app)
      .get('/cities')
      .query({ name: 'C', uf: 'SP' });

    expect(byName.body.map((c: { name: string }) => c.name)).toEqual([
      'CAMPINAS',
    ]);
    expect(byUf.body.map((c: { name: string }) => c.name)).toEqual([
      'CURITIBA',
    ]);
    expect(both.body.map((c: { name: string }) => c.name)).toEqual([
      'CAMPINAS',
    ]);
  });

  it('mostra a cidade pelo id e valida ids inexistentes e inválidos', async () => {
    const found = await request(app).get(`/cities/${cityId}`);
    const missing = await request(app).get(
      '/cities/00000000-0000-4000-8000-000000000000',
    );
    const invalid = await request(app).get('/cities/abc');

    expect(found.status).toBe(200);
    expect(found.body.name).toBe('CAMPINAS');
    expect(missing.status).toBe(400);
    expect(missing.body.message).toBe('City not found');
    expect(invalid.status).toBe(400);
  });

  describe('Clientes (e2e)', () => {
    let customerId: string;

    it('cadastra cliente normalizando o nome (sem acentos, maiúsculo)', async () => {
      const res = await request(app).post('/customers').send({
        fullname: 'João da Silva',
        gender: 'male',
        birthday: '1990-05-10',
        city_id: cityId,
      });

      customerId = res.body.id;

      expect(res.status).toBe(200);
      expect(res.body).toEqual(
        expect.objectContaining({
          id: expect.stringMatching(UUID),
          fullname: 'JOAO DA SILVA',
        }),
      );
    });

    it('recusa cidade inexistente e nascimento no futuro', async () => {
      const noCity = await request(app).post('/customers').send({
        fullname: 'Ana',
        gender: 'female',
        birthday: '1995-01-01',
        city_id: '00000000-0000-4000-8000-000000000000',
      });
      const future = await request(app).post('/customers').send({
        fullname: 'Ana',
        gender: 'female',
        birthday: '2999-01-01',
        city_id: cityId,
      });

      expect(noCity.status).toBe(400);
      expect(future.status).toBe(400);
    });

    it('mostra o cliente com a idade calculada e a cidade', async () => {
      const res = await request(app).get(`/customers/${customerId}`);

      expect(res.status).toBe(200);
      expect(res.body.age).toEqual(expect.any(Number));
      expect(res.body.age).toBeGreaterThanOrEqual(35);
      expect(res.body.city).toEqual(
        expect.objectContaining({ id: cityId, name: 'CAMPINAS' }),
      );
    });

    it('busca por nome ignorando acentos e caixa', async () => {
      const res = await request(app).get('/customers').query({ name: 'joão' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
    });

    it('renomeia o cliente', async () => {
      const res = await request(app)
        .patch(`/customers/${customerId}`)
        .send({ fullname: 'João Souza' });

      expect(res.status).toBe(200);
      expect(res.body.fullname).toBe('JOAO SOUZA');
    });

    it('remove o cliente', async () => {
      const del = await request(app).delete(`/customers/${customerId}`);
      const show = await request(app).get(`/customers/${customerId}`);

      expect(del.status).toBe(200);
      expect(del.body.message).toBe('The customer is deleted');
      expect(show.status).toBe(400);
    });
  });
});
