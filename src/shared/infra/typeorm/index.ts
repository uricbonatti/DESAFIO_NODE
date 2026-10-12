import { DataSource } from 'typeorm';

import City from '@modules/cities/infra/typeorm/entities/City';
import Customer from '@modules/customers/infra/typeorm/entities/Customer';

export const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'docker',
  database: process.env.DB_NAME || 'desafio1_compasso',
  entities: [City, Customer],
  migrations: [`${__dirname}/migrations/*.{ts,js}`],
  // Aplica as migrations pendentes ao iniciar (banco novo sobe pronto, inclusive no docker compose).
  migrationsRun: true,
});

export default dataSource;
