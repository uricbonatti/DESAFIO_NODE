import AppError from '@shared/errors/AppError';
import FakeAdjustTextProvider from '@shared/container/providers/AdjustTextProvider/fakes/FakeAdjustTextProvider';
import FakeCustomersRepository from '../repositories/fakes/FakeCustomersRepository';
import RenameCustomerService from './RenameCustomerService';

let fakeCustomersRepository: FakeCustomersRepository;
let fakeAdjustTextProvider: FakeAdjustTextProvider;
let renameCustomer: RenameCustomerService;

describe('RenameCustomer', () => {
  beforeEach(() => {
    fakeCustomersRepository = new FakeCustomersRepository();
    fakeAdjustTextProvider = new FakeAdjustTextProvider();
    renameCustomer = new RenameCustomerService(
      fakeCustomersRepository,
      fakeAdjustTextProvider,
    );
  });
  it('should be able to rename a customer', async () => {
    const { id } = await fakeCustomersRepository.create({
      birthday: new Date(1992, 1, 1),
      fullname: 'John Duo',
      city_id: 'abc',
      gender: 'male',
    });
    const updatedCustomer = await renameCustomer.execute({
      fullname: 'John Renew',
      id,
    });
    expect(updatedCustomer.fullname).toBe('JOHN RENEW');
    expect(updatedCustomer.id).toEqual(id);
  });

  it('should not be able to rename a non-existing customer', async () => {
    await expect(
      renameCustomer.execute({
        fullname: 'John Renew',
        id: 'abc',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to rename a customer with an empty string', async () => {
    const { id } = await fakeCustomersRepository.create({
      birthday: new Date(1992, 1, 1),
      fullname: 'John Duo',
      city_id: 'abc',
      gender: 'male',
    });
    await expect(
      renameCustomer.execute({
        fullname: '',
        id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
