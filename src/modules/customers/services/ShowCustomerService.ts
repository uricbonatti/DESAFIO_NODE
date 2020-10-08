import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Customer from '../infra/typeorm/entities/Customer';

interface IRequest {
  id: string;
}

@injectable()
class ShowCustomerService {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ id }: IRequest): Promise<Customer> {
    const customer = await this.customersRepository.findById(id);
    if (!customer) {
      throw new AppError('Customer cannot be found.');
    }
    return customer;
  }
}
export default ShowCustomerService;
