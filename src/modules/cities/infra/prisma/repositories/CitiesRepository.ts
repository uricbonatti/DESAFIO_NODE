import ICreateCityDTO from "@modules/cities/dtos/ICreateCityDTO";
import ISearchCityDTO from "@modules/cities/dtos/ISearchCityDTO";
import { City } from "@modules/cities/entities/City";
import ICitiesRepository from "@modules/cities/repositories/ICitiesRepository";
import { prisma } from '@shared/infra/prisma'


class CitiesRepository implements ICitiesRepository{
  private ormRepository: typeof prisma.city;
  constructor() {
    this.ormRepository = prisma.city;
  }
 public async create({name,uf}: ICreateCityDTO): Promise<City> {
   const city = await this.ormRepository.create({
    data: {uf, name, updated_at: new Date()}
   })
   return city;
  }
  public async search({uf, name}: ISearchCityDTO): Promise<City[]> {
    if (name && uf) {
      const cities = await this.ormRepository.findMany({
        where: {
          name: { contains: name },
          uf
        }
      })
      return cities;
    }
    if (name) {
      const cities = await this.ormRepository.findMany({
        where: {
          name: { contains: name },
        }
      })
      return cities
    }
    if (uf) {
      const cities = await this.ormRepository.findMany({
        where: {
          uf
        }
      })
      return cities
    }
    return this.ormRepository.findMany()
  }
  public async findById(id: string): Promise<City | undefined | null> {
    return this.ormRepository.findUnique({where:{id}})
  }
  public async exist({ uf, name }: ICreateCityDTO): Promise<boolean> {
    const city = await this.ormRepository.findFirst({ where: { name, uf } })
    if (!city) {
      return false;
    }
    return true;
  }
  
}
export default CitiesRepository;
