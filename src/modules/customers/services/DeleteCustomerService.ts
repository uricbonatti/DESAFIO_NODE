import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import {Customer} from '../entities/Customer';

interface IRequest {
  id: string;
}

@injectable()
class DeleteCustomerService {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ id }: IRequest): Promise<Customer> {
    const customer = await this.customersRepository.findById(id);
    if (!customer) {
      throw new AppError('Customer cannot be found.');
    }
    await this.customersRepository.delete(id);
    return customer;
  }
}
export default DeleteCustomerService;
