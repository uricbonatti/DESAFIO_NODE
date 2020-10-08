import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateCityService from '@modules/cities/services/CreateCityService';
import SearchCitiesService from '@modules/cities/services/SearchCitiesService';
import ShowCityService from '@modules/cities/services/ShowCityService';

export default class CitiesController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, uf } = request.body;
    const createCity = container.resolve(CreateCityService);

    const city = await createCity.execute({ name, uf });
    return response.json(city);
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const { name, uf } = request.query;
    const searchCities = container.resolve(SearchCitiesService);
    const stringfiedName = name ? String(name) : undefined;
    const stringfiedUf = uf ? String(uf) : undefined;
    const cities = await searchCities.execute({
      name: stringfiedName,
      uf: stringfiedUf,
    });
    return response.json(cities);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const showCity = container.resolve(ShowCityService);
    const city = await showCity.execute({ id });
    return response.json(city);
  }
}
