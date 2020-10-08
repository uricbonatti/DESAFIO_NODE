import { Repository, getRepository, Like } from 'typeorm';

import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import ICreateCustomerDTO from '@modules/customers/dtos/ICreateCustomerDTO';
import Customer from '../entities/Customer';

class CustomersRepository implements ICustomersRepository {
  private ormRepository: Repository<Customer>;

  constructor() {
    this.ormRepository = getRepository(Customer);
  }

  public async create({
    fullname,
    gender,
    birthday,
    city_id,
  }: ICreateCustomerDTO): Promise<Customer> {
    const customer = this.ormRepository.create({
      fullname,
      gender,
      birthday,
      city_id,
    });
    await this.ormRepository.save(customer);

    return customer;
  }

  public async save(customer: Customer): Promise<Customer> {
    return this.ormRepository.save(customer);
  }

  public async findById(id: string): Promise<Customer | undefined> {
    const findCustomer = await this.ormRepository.findOne(id);
    return findCustomer;
  }

  public async findByName(customer_name: string): Promise<Customer[]> {
    const findCustomers = await this.ormRepository.find({
      where: { fullname: Like(`%${customer_name}%`) },
    });
    return findCustomers;
  }

  public async delete(customer_id: string): Promise<void> {
    await this.ormRepository.delete(customer_id);
  }
}
export default CustomersRepository;
