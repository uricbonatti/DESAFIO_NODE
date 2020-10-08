import AppError from '@shared/errors/AppError';
import CreateCustomerService from '@modules/customers/services/CreateCustomerService';
import DeleteCustomerService from '@modules/customers/services/DeleteCustomerService';

import FakeAdjustTextProvider from '@shared/container/providers/AdjustTextProvider/fakes/FakeAdjustTextProvider';
import CreateCityService from '@modules/cities/services/CreateCityService';

import FakeCitiesRepository from '@modules/cities/repositories/fakes/FakeCitiesRepository';
import FakeCustomersRepository from '../repositories/fakes/FakeCustomersRepository';

let fakeCustomersRepository: FakeCustomersRepository;
let fakeAdjustTextProvider: FakeAdjustTextProvider;
let fakeCitiesRepository: FakeCitiesRepository;
let createCustomer: CreateCustomerService;
let deleteCustomer: DeleteCustomerService;
let createCity: CreateCityService;

describe('DeleteCustomer', () => {
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
    deleteCustomer = new DeleteCustomerService(fakeCustomersRepository);
  });

  it('should be able to delete a customer', async () => {
    const city = await createCity.execute({ name: 'Campinas', uf: 'SP' });
    const { id } = await createCustomer.execute({
      fullname: 'John Duo',
      birthday: new Date(1992, 1, 1),
      gender: 'male',
      city_id: city.id,
    });
    const deletedCustomer = await deleteCustomer.execute({ id });
    expect(deletedCustomer).toHaveProperty('fullname');
    expect(deletedCustomer).toBeTruthy();
  });

  it('shoud not be able to delete a non-existing customer', async () => {
    await expect(deleteCustomer.execute({ id: 'abc' })).rejects.toBeInstanceOf(
      AppError,
    );
  });
});
