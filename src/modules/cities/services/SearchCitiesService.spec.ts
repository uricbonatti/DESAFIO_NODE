import FakeAdjustTextProvider from '@shared/container/providers/AdjustTextProvider/fakes/FakeAdjustTextProvider';
import FakeCitiesRepository from '../repositories/fakes/FakeCitiesRepository';
import SearchCitiesService from './SearchCitiesService';
import CreateCityService from './CreateCityService';

let fakeCitiesRepository: FakeCitiesRepository;
let createCity: CreateCityService;
let searchCities: SearchCitiesService;
let fakeAdjustTextProvider: FakeAdjustTextProvider;

describe('SearchCities', () => {
  beforeEach(() => {
    fakeCitiesRepository = new FakeCitiesRepository();

    fakeAdjustTextProvider = new FakeAdjustTextProvider();
    createCity = new CreateCityService(
      fakeCitiesRepository,
      fakeAdjustTextProvider,
    );
    searchCities = new SearchCitiesService(
      fakeCitiesRepository,
      fakeAdjustTextProvider,
    );
  });

  it('should be able to list cities', async () => {
    const city1 = await createCity.execute({
      name: 'Mogi Guaçu',
      uf: 'sp',
    });
    const city2 = await createCity.execute({
      name: 'Mogi Mirim',
      uf: 'sp',
    });
    const cities = await searchCities.execute({});
    expect(cities).toEqual([city1, city2]);
  });

  it('should be able to list cities with matched name', async () => {
    const city = await createCity.execute({
      name: 'Mogi Guaçu',
      uf: 'sp',
    });
    await createCity.execute({
      name: 'Mogi Mirim',
      uf: 'sp',
    });
    const cities = await searchCities.execute({ name: 'Guaçu' });
    expect(cities).toEqual([city]);
  });

  it('should be able to list cities with matched uf', async () => {
    const city1 = await createCity.execute({
      name: 'Mogi Guaçu',
      uf: 'sp',
    });
    const city2 = await createCity.execute({
      name: 'Mogi Mirim',
      uf: 'sp',
    });
    await createCity.execute({
      name: 'Inconfidentes',
      uf: 'mg',
    });
    const cities = await searchCities.execute({ uf: 'sp' });
    expect(cities).toEqual([city1, city2]);
  });

  it('should be able to list cities with matched uf and name', async () => {
    await createCity.execute({
      name: 'Mogi Guaçu',
      uf: 'sp',
    });
    const city = await createCity.execute({
      name: 'Mogi Mirim',
      uf: 'sp',
    });
    await createCity.execute({
      name: 'Inconfidentes',
      uf: 'mg',
    });
    const cities = await searchCities.execute({ uf: 'sp', name: 'mirim' });
    expect(cities).toEqual([city]);
  });
});
