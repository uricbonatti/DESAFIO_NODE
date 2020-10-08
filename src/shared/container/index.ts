import { container } from 'tsyringe';

import './providers';

import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import CustomersRepository from '@modules/customers/infra/typeorm/repositories/CustomersRepository';
import CitiesRepository from '@modules/cities/infra/typeorm/repositories/CitiesRepository';
import ICitiesRepository from '@modules/cities/repositories/ICitiesRepository';

container.registerSingleton<ICitiesRepository>(
  'CitiesRepository',
  CitiesRepository,
);

container.registerSingleton<ICustomersRepository>(
  'CustomersRepository',
  CustomersRepository,
);
