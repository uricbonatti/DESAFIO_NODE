import AppError from '@shared/errors/AppError';
import FakeCustomersRepository from '../repositories/fakes/FakeCustomersRepository';
import ShowCustomerService from './ShowCustomerService';

let fakeCustomersRepository: FakeCustomersRepository;
let showCustomer: ShowCustomerService;

describe('ShowCustomer', () => {
  beforeEach(() => {
    fakeCustomersRepository = new FakeCustomersRepository();
    showCustomer = new ShowCustomerService(fakeCustomersRepository);
  });
  it('should be able to show a customer', async () => {
    const { id } = await fakeCustomersRepository.create({
      birthday: new Date(1992, 1, 1),
      fullname: 'John Duo',
      city_id: 'abc',
      gender: 'male',
    });
    const customer = await showCustomer.execute({ id });
    expect(customer).toHaveProperty('fullname');
    expect(customer.fullname).toBe('John Duo');
  });
  it('should not be able to show a non-exixting customer', async () => {
    await expect(showCustomer.execute({ id: 'abc' })).rejects.toBeInstanceOf(
      AppError,
    );
  });
});
