import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IAdjustTextProvider from '@shared/container/providers/AdjustTextProvider/models/IAdjustTextProvider';
import ICitiesRepository from '../repositories/ICitiesRepository';
import {City} from '../entities/City';

interface IRequest {
  name: string;
  uf: string;
}

@injectable()
class CreateCityService {
  constructor(
    @inject('CitiesRepository')
    private citiesRepository: ICitiesRepository,
    @inject('AdjustTextProvider')
    private adjustTextProvider: IAdjustTextProvider,
  ) {}

  public async execute({ name, uf }: IRequest): Promise<City> {
    if (name.length === 0) {
      throw new AppError('This city must contain a name');
    }
    if (uf.length === 0) {
      throw new AppError('This city must contain a uf');
    }
    const adjustedName = await this.adjustTextProvider.adjust(name);
    const adjustedUF = await this.adjustTextProvider.adjust(uf);
    const createdCity = await this.citiesRepository.exist({
      name: adjustedName,
      uf: adjustedUF,
    });
    if (createdCity) {
      throw new AppError('This city is already registered');
    }
    const city = await this.citiesRepository.create({
      name: adjustedName,
      uf: adjustedUF,
    });

    return city;
  }
}
export default CreateCityService;
