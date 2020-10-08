export default interface ICreateCustomerDTO {
  fullname: string;
  gender: 'male' | 'female';
  birthday: Date;
  city_id: string;
}
