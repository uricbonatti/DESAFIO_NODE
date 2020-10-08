import FakeAdjustTextProvider from '@shared/container/providers/AdjustTextProvider/fakes/FakeAdjustTextProvider';
import FakeCustomersRepository from '../repositories/fakes/FakeCustomersRepository';
import SearchCustomerService from './SearchCustomerService';

let fakeCustomersRepository: FakeCustomersRepository;
let fakeAdjustTextProvider: FakeAdjustTextProvider;
let searchCustomer: SearchCustomerService;

describe('SearchCustomer', () => {
  beforeAll(() => {
    fakeCustomersRepository = new FakeCustomersRepository();
    fakeAdjustTextProvider = new FakeAdjustTextProvider();
    searchCustomer = new SearchCustomerService(
      fakeCustomersRepository,
      fakeAdjustTextProvider,
    );
  });
  it('should be able to list the customers with matched name', async () => {
    const customer1 = await fakeCustomersRepository.create({
      birthday: new Date(1992, 1, 1),
      fullname: await fakeAdjustTextProvider.adjust('John Duo'),
      city_id: 'abc',
      gender: 'male',
    });
    const customer2 = await fakeCustomersRepository.create({
      birthday: new Date(1992, 1, 1),
      fullname: await fakeAdjustTextProvider.adjust('Seven John'),
      city_id: 'abc',
      gender: 'male',
    });
    await fakeCustomersRepository.create({
      birthday: new Date(1992, 1, 1),
      fullname: await fakeAdjustTextProvider.adjust('Erika Duo'),
      city_id: 'abc',
      gender: 'female',
    });
    const foundCustomers = await searchCustomer.execute({ name: 'John' });
    expect(foundCustomers).toEqual([customer1, customer2]);
  });
});
