import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import IAdjustTextProvider from '@shared/container/providers/AdjustTextProvider/models/IAdjustTextProvider';
import ICitiesRepository from '../repositories/ICitiesRepository';
import City from '../infra/typeorm/entities/City';

interface IRequest {
  name?: string;
  uf?: string;
}

@injectable()
class SearchCitiesService {
  constructor(
    @inject('CitiesRepository')
    private citiesRepository: ICitiesRepository,
    @inject('AdjustTextProvider')
    private adjustTextProvider: IAdjustTextProvider,
  ) {}

  public async execute({ name, uf }: IRequest): Promise<City[]> {
    const cities = await this.citiesRepository.search({
      uf: uf ? await this.adjustTextProvider.adjust(uf) : undefined,
      name: name ? await this.adjustTextProvider.adjust(name) : undefined,
    });
    return cities;
  }
}
export default SearchCitiesService;
