import { City } from "@modules/cities/entities/City";

type Customer = {
  id: string;
  fullname: string;
  gender: string;
  birthday: Date;
  city_id: string;
  city: City
  created_at: Date;
  updated_at: Date;
}

export { Customer };
