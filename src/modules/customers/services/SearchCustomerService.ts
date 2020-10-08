import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import IAdjustTextProvider from '@shared/container/providers/AdjustTextProvider/models/IAdjustTextProvider';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Customer from '../infra/typeorm/entities/Customer';

interface IRequest {
  name: string;
}

@injectable()
class SearchCustomerService {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,

    @inject('AdjustTextProvider')
    private adjustTextProvider: IAdjustTextProvider,
  ) {}

  public async execute({ name }: IRequest): Promise<Customer[]> {
    const customers = await this.customersRepository.findByName(
      await this.adjustTextProvider.adjust(name),
    );

    return customers;
  }
}
export default SearchCustomerService;
