import AppError from '@shared/errors/AppError';
import FakeAdjustTextProvider from '@shared/container/providers/AdjustTextProvider/fakes/FakeAdjustTextProvider';
import FakeCitiesRepository from '../repositories/fakes/FakeCitiesRepository';
import ShowCityService from './ShowCityService';
import CreateCityService from './CreateCityService';

let fakeCitiesRepository: FakeCitiesRepository;
let createCity: CreateCityService;
let showCity: ShowCityService;

let fakeAdjustTextProvider: FakeAdjustTextProvider;

describe('ShowCity', () => {
  beforeEach(() => {
    fakeCitiesRepository = new FakeCitiesRepository();
    fakeAdjustTextProvider = new FakeAdjustTextProvider();
    createCity = new CreateCityService(
      fakeCitiesRepository,
      fakeAdjustTextProvider,
    );
    showCity = new ShowCityService(fakeCitiesRepository);
  });

  it('should be able to show the city ', async () => {
    const { id } = await createCity.execute({
      name: 'Mogi Guaçu',
      uf: 'SP',
    });
    const city = await showCity.execute({ id });
    expect(city && city.name).toBe('MOGI GUAÇU');
    expect(city && city.uf).toBe('SP');
  });

  it('should not be able to show the city with an invalid id ', async () => {
    await expect(showCity.execute({ id: 'abcde' })).rejects.toBeInstanceOf(
      AppError,
    );
  });
});
