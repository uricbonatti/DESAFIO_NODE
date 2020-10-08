import Customer from '../infra/typeorm/entities/Customer';
import ICreateCustomerDTO from '../dtos/ICreateCustomerDTO';

export default interface ICustomersRepository {
  create(data: ICreateCustomerDTO): Promise<Customer>;
  findById(customer_id: string): Promise<Customer | undefined>;
  findByName(customer_name: string): Promise<Customer[]>;
  save(customer: Customer): Promise<Customer>;
  delete(customer_id: string): Promise<void>;
}
