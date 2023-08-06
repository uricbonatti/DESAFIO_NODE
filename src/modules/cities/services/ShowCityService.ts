import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import ICitiesRepository from '../repositories/ICitiesRepository';
import {City} from '../entities/City';

interface IRequest {
  id: string;
}

@injectable()
class ShowCityService {
  constructor(
    @inject('CitiesRepository')
    private citiesRepository: ICitiesRepository,
  ) {}

  public async execute({ id }: IRequest): Promise<City | undefined> {
    const city = await this.citiesRepository.findById(id);
    if (!city) {
      throw new AppError('City not found');
    }
    return city;
  }
}
export default ShowCityService;
