import ICreateCityDTO from '../dtos/ICreateCityDTO';
import City from '../infra/typeorm/entities/City';
import ISearchCityDTO from '../dtos/ISearchCityDTO';

export default interface ICitiesRepository {
  create(data: ICreateCityDTO): Promise<City>;
  search(data: ISearchCityDTO): Promise<City[]>;
  findById(id: string): Promise<City | undefined>;
  exist({ uf, name }: ICreateCityDTO): Promise<boolean>;
}
