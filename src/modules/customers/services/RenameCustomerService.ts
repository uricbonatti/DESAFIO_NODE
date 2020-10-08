import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import IAdjustTextProvider from '@shared/container/providers/AdjustTextProvider/models/IAdjustTextProvider';
import Customer from '../infra/typeorm/entities/Customer';

interface IRequest {
  id: string;
  fullname: string;
}

@injectable()
class RenameCustomerService {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,

    @inject('AdjustTextProvider')
    private adjustTextProvider: IAdjustTextProvider,
  ) {}

  public async execute({ id, fullname }: IRequest): Promise<Customer> {
    const customer = await this.customersRepository.findById(id);
    if (!customer) {
      throw new AppError('Customer cannot be found.');
    }
    if (fullname.length === 0) {
      throw new AppError('Customer cannot be renamed with an empty string.');
    }
    customer.fullname = await this.adjustTextProvider.adjust(fullname);
    return this.customersRepository.save(customer);
  }
}
export default RenameCustomerService;
