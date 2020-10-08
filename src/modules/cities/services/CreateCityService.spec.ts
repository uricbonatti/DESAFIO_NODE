import AppError from '@shared/errors/AppError';
import FakeAdjustTextProvider from '@shared/container/providers/AdjustTextProvider/fakes/FakeAdjustTextProvider';
import FakeCitiesRepository from '../repositories/fakes/FakeCitiesRepository';
import CreateCityService from './CreateCityService';

let fakeCitiesRepository: FakeCitiesRepository;
let createCity: CreateCityService;
let fakeAdjustTextProvider: FakeAdjustTextProvider;

describe('CreateCity', () => {
  beforeEach(() => {
    fakeCitiesRepository = new FakeCitiesRepository();
    fakeAdjustTextProvider = new FakeAdjustTextProvider();
    createCity = new CreateCityService(
      fakeCitiesRepository,
      fakeAdjustTextProvider,
    );
  });

  it('should be able to create a new city', async () => {
    const city = await createCity.execute({
      name: 'Mogi Guaçu',
      uf: 'sp',
    });
    expect(city).toHaveProperty('id');
  });
  it('should not be able to create city without name', async () => {
    await expect(
      createCity.execute({
        name: '',
        uf: 'sp',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create city without uf', async () => {
    await expect(
      createCity.execute({
        name: 'Campinas',
        uf: '',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create the same city', async () => {
    await createCity.execute({
      name: 'Mogi Guaçu',
      uf: 'sp',
    });

    await expect(
      createCity.execute({
        name: 'Mogi Guaçu',
        uf: 'sp',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create cities with same name in many ufs', async () => {
    await createCity.execute({
      name: 'Campinas',
      uf: 'sp',
    });

    const city = await createCity.execute({
      name: 'Campinas',
      uf: 'ms',
    });
    expect(city).toHaveProperty('id');
  });
});
