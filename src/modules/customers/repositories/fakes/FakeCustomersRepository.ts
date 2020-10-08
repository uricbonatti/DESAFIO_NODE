import { v4 } from 'uuid';
import Customer from '@modules/customers/infra/typeorm/entities/Customer';
import ICreateCustomerDTO from '@modules/customers/dtos/ICreateCustomerDTO';
import ICustomersRepository from '../ICustomersRepository';

class FakeCustomersRepository implements ICustomersRepository {
  private customers: Customer[] = [];

  public async create({
    fullname,
    birthday,
    gender,
    city_id,
  }: ICreateCustomerDTO): Promise<Customer> {
    const customer = new Customer();
    Object.assign(customer, {
      id: v4(),
      fullname,
      birthday,
      gender,
      city_id,
    });
    this.customers.push(customer);
    return customer;
  }

  public async findById(customer_id: string): Promise<Customer | undefined> {
    const findCustomer = this.customers.find(
      customer => customer.id === customer_id,
    );
    return findCustomer;
  }

  public async findByName(customer_name: string): Promise<Customer[]> {
    const foundCustomers = await this.customers.filter(
      customer => customer.fullname.indexOf(customer_name) > -1,
    );
    return foundCustomers;
  }

  public async save(customer: Customer): Promise<Customer> {
    const findIndex = this.customers.findIndex(
      findCustomer => findCustomer.id === customer.id,
    );
    this.customers[findIndex] = customer;

    return customer;
  }

  public async delete(customer_id: string): Promise<void> {
    const findIndex = this.customers.findIndex(
      findCustomer => findCustomer.id === customer_id,
    );
    this.customers = [...this.customers.slice(findIndex, 1)];
  }
}
export default FakeCustomersRepository;
