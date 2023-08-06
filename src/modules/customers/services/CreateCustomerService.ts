import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import { isBefore } from 'date-fns';

import AppError from '@shared/errors/AppError';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import ICitiesRepository from '@modules/cities/repositories/ICitiesRepository';
import IAdjustTextProvider from '@shared/container/providers/AdjustTextProvider/models/IAdjustTextProvider';
import {Customer} from '../entities/Customer';

interface IRequest {
  fullname: string;
  birthday: Date;
  gender: 'male' | 'female';
  city_id: string;
}

@injectable()
class CreateCustomerService {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,

    @inject('CitiesRepository')
    private citiesRepository: ICitiesRepository,

    @inject('AdjustTextProvider')
    private adjustTextProvider: IAdjustTextProvider,
  ) {}

  public async execute({
    fullname,
    gender,
    birthday,
    city_id,
  }: IRequest): Promise<Customer> {
    const checkCity = await this.citiesRepository.findById(city_id);
    if (!checkCity) {
      throw new AppError('City Id not found, please use a valid City ID.');
    }
    if (!isBefore(birthday, new Date())) {
      throw new AppError('Birthday must be in past');
    }
    const customer = await this.customersRepository.create({
      fullname: await this.adjustTextProvider.adjust(fullname),
      gender,
      birthday,
      city_id,
    });
    return customer;
  }
}
export default CreateCustomerService;
