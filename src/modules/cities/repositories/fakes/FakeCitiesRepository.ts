import { v4 } from 'uuid';

import ICreateCityDTO from '@modules/cities/dtos/ICreateCityDTO';
import ISearchCityDTO from '@modules/cities/dtos/ISearchCityDTO';
import {City} from '../../entities/City';
import ICitiesRepository from '../ICitiesRepository';

class FakeCitiesRepository implements ICitiesRepository {
  private cities: City[] = [];

  public async create({ name, uf }: ICreateCityDTO): Promise<City> {
    const city: City = { id: v4(), name, uf } as City
    this.cities.push(city);
    return city;
  }

  public async search({ uf, name }: ISearchCityDTO): Promise<City[]> {
    if (name && uf) {
      const foundCities = this.cities.filter(
        city => city.name.indexOf(name) > -1,
      );
      const filteredCities = foundCities.filter(city => uf === city.uf);
      return filteredCities;
    }
    if (name) {
      const foundCities = await this.cities.filter(
        city => city.name.indexOf(name) > -1,
      );
      return foundCities;
    }
    if (uf) {
      const foundCities = this.cities.filter(city => city.uf === uf);
      return foundCities;
    }
    return this.cities;
  }

  public async findById(id: string): Promise<City | undefined> {
    const findCity = this.cities.find(city => city.id === id);
    return findCity;
  }

  public async exist({ uf, name }: ICreateCityDTO): Promise<boolean> {
    const foundCity = this.cities.find(
      city => city.uf === uf && city.name === name,
    );
    return !!foundCity;
  }
}

export default FakeCitiesRepository;
