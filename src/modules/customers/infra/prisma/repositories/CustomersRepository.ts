import ICreateCustomerDTO from "@modules/customers/dtos/ICreateCustomerDTO";
import { Customer } from "@modules/customers/entities/Customer";
import ICustomersRepository from "@modules/customers/repositories/ICustomersRepository";
import { prisma } from "@shared/infra/prisma";


class CustomersRepository implements ICustomersRepository {
  private ormRepository: typeof prisma.customers;
  constructor() {
    this.ormRepository = prisma.customers;
  }
  public async create({
    fullname,
    gender,
    birthday,
    city_id,
  }: ICreateCustomerDTO): Promise<Customer> {
    const customer = await this.ormRepository.create({
      data: {
        fullname,
        gender,
        birthday,
        updated_at: new Date(),
        city_id,
      },
      include: {
        city: true
      }
    })
    return customer;
  }
  public async findById(id: string): Promise<Customer | null | undefined> {
    return this.ormRepository.findUnique({
      where: { id },
      include: { city: true }
    })
  }
  public async findByName(customer_name: string): Promise<Customer[]> {
    return this.ormRepository.findMany({
      where: { fullname: {contains: customer_name} },
      include: { city: true }
    })
  }
  public async save({ id, ...rest }: Customer): Promise<Customer> {
    const { birthday, city_id, fullname, gender} = rest;
   return this.ormRepository.update(
     {
       where: { id},
       data: { birthday, city_id, fullname, gender },
       include: { city: true }
     }
    )
  }
  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete({where: {id}})
  }

}
export default CustomersRepository;
