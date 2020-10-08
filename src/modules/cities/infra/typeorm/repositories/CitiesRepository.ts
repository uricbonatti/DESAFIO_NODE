import { getRepository, Like, Repository } from 'typeorm';

import ICitiesRepository from '@modules/cities/repositories/ICitiesRepository';
import ICreateCityDTO from '@modules/cities/dtos/ICreateCityDTO';
import ISearchCityDTO from '@modules/cities/dtos/ISearchCityDTO';
import City from '../entities/City';

class CitiesRepository implements ICitiesRepository {
  private ormRepository: Repository<City>;

  constructor() {
    this.ormRepository = getRepository(City);
  }

  public async create({ name, uf }: ICreateCityDTO): Promise<City> {
    const city = this.ormRepository.create({
      name,
      uf,
    });
    await this.ormRepository.save(city);

    return city;
  }

  public async exist({ uf, name }: ICreateCityDTO): Promise<boolean> {
    const city = await this.ormRepository.findOne({
      where: { name, uf },
    });
    if (!city) {
      return false;
    }
    return true;
  }

  public async search({ uf, name }: ISearchCityDTO): Promise<City[]> {
    if (name && uf) {
      const cities = await this.ormRepository.find({
        where: { name: Like(`%${name}%`) },
      });
      const filteredCities = cities.filter(city => uf === city.uf);
      return filteredCities;
    }
    if (name) {
      const cities = await this.ormRepository.find({
        where: { name: Like(`%${name}%`) },
      });
      return cities;
    }
    if (uf) {
      const cities = await this.ormRepository.find({
        where: { uf },
      });
      return cities;
    }
    const cities = await this.ormRepository.find();
    return cities;
  }

  public async findById(id: string): Promise<City | undefined> {
    const city = await this.ormRepository.findOne({ where: { id } });
    return city;
  }
}
export default CitiesRepository;
