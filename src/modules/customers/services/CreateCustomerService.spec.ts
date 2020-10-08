import AppError from '@shared/errors/AppError';
import CreateCustomerService from '@modules/customers/services/CreateCustomerService';
import FakeAdjustTextProvider from '@shared/container/providers/AdjustTextProvider/fakes/FakeAdjustTextProvider';
import CreateCityService from '@modules/cities/services/CreateCityService';
import FakeCitiesRepository from '@modules/cities/repositories/fakes/FakeCitiesRepository';
import FakeCustomersRepository from '../repositories/fakes/FakeCustomersRepository';

let fakeCustomersRepository: FakeCustomersRepository;
let fakeAdjustTextProvider: FakeAdjustTextProvider;
let fakeCitiesRepository: FakeCitiesRepository;
let createCustomer: CreateCustomerService;
let createCity: CreateCityService;

describe('CreateCustomer', () => {
  beforeEach(() => {
    fakeAdjustTextProvider = new FakeAdjustTextProvider();
    fakeCustomersRepository = new FakeCustomersRepository();
    fakeCitiesRepository = new FakeCitiesRepository();
    createCity = new CreateCityService(
      fakeCitiesRepository,
      fakeAdjustTextProvider,
    );
    createCustomer = new CreateCustomerService(
      fakeCustomersRepository,
      fakeCitiesRepository,
      fakeAdjustTextProvider,
    );
  });
  it('should be able to create a new customer', async () => {
    const city = await createCity.execute({ name: 'Campinas', uf: 'SP' });
    const customer = await createCustomer.execute({
      fullname: 'John Duo',
      birthday: new Date(1992, 1, 1),
      gender: 'male',
      city_id: city.id,
    });
    expect(customer).toHaveProperty('id');
  });

  it('should not be able to create a new customer without a valid city', async () => {
    await expect(
      createCustomer.execute({
        fullname: 'John Duo',
        birthday: new Date(1992, 1, 1),
        gender: 'male',
        city_id: 'abc',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new customer with future birthday', async () => {
    const city = await createCity.execute({ name: 'Campinas', uf: 'SP' });
    await expect(
      createCustomer.execute({
        fullname: 'John Duo',
        birthday: new Date(2032, 1, 1),
        gender: 'male',
        city_id: city.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
