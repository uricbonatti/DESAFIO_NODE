import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';
import CreateCustomerService from '@modules/customers/services/CreateCustomerService';
import DeleteCustomerService from '@modules/customers/services/DeleteCustomerService';
import RenameCustomerService from '@modules/customers/services/RenameCustomerService';
import SearchCustomerService from '@modules/customers/services/SearchCustomerService';
import ShowCustomerService from '@modules/customers/services/ShowCustomerService';

export default class CustomersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { fullname, gender, birthday, city_id } = request.body;
    const createCustomer = container.resolve(CreateCustomerService);
    const customer = await createCustomer.execute({
      fullname,
      gender,
      birthday,
      city_id,
    });
    return response.json(customer);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const deleteCustomer = container.resolve(DeleteCustomerService);
    const customer = await deleteCustomer.execute({ id });

    return response.json({ message: 'The customer is deleted', customer });
  }

  public async rename(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { fullname } = request.body;
    const renameCustomer = container.resolve(RenameCustomerService);
    const customer = await renameCustomer.execute({ id, fullname });
    return response.json(customer);
  }

  public async search(request: Request, response: Response): Promise<Response> {
    const { name } = request.query;
    const searchCustomer = container.resolve(SearchCustomerService);
    const custormers = await searchCustomer.execute({ name: String(name) });
    return response.json(custormers);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const showCustomer = container.resolve(ShowCustomerService);
    const customer = await showCustomer.execute({ id });
    return response.json(classToClass(customer));
  }
}
