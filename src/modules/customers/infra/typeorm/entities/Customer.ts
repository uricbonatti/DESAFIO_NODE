import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';
import { differenceInYears } from 'date-fns';
import City from '@modules/cities/infra/typeorm/entities/City';

@Entity('customers')
class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullname: string;

  @Column()
  gender: string;

  @Column()
  birthday: Date;

  @Expose({ name: 'age' })
  getAge(): number {
    return differenceInYears(Date.now(), this.birthday);
  }

  @Column()
  city_id: string;

  @ManyToOne(() => City, { eager: true })
  @JoinColumn({ name: 'city_id' })
  city: City;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Customer;
