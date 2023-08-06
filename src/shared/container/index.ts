import { container } from 'tsyringe';

import './providers';

import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
// import TypeormCustomersRepository from '@modules/customers/infra/typeorm/repositories/CustomersRepository';
import PrismaCustomersRepository from '@modules/customers/infra/prisma/repositories/CustomersRepository';
import PrismaCitiesRepository from '@modules/cities/infra/prisma/repositories/CitiesRepository';
// import TypeormCitiesRepository from '@modules/cities/infra/typeorm/repositories/CitiesRepository';
import ICitiesRepository from '@modules/cities/repositories/ICitiesRepository';

container.registerSingleton<ICitiesRepository>(
  'CitiesRepository',
  PrismaCitiesRepository,
);

container.registerSingleton<ICustomersRepository>(
  'CustomersRepository',
  PrismaCustomersRepository,
);
