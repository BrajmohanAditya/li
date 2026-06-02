import {
  Column,
  Entity,
  OneToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';

import { Sheet } from 'src/sheets/entities/sheet.entity';
import { LibraryPrice } from 'src/library_price/entities/library_price.entity';
import { LibraryFeature } from 'src/library-feature/entities/library-feature.entity';
import { Admin } from 'src/admins/entities/admin.entity';
import { User } from 'src/users/entities/user.entity';
import { Booking } from 'src/bookings/entities/booking.entity';

@Entity('libraries')
export class Library {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Admin, (admin) => admin.libraries, {
    onDelete: 'CASCADE',
    nullable: true, // IMPORTANT
  })
  @JoinColumn({ name: 'adminId' })
  admin!: Admin;

  @Column({ nullable: true })
  name!: string;

  @Column()
  address!: string;

  @Column({ nullable: true })
  address2!: string;

  @Column()
  city!: string;

  @Column()
  state!: string;

  @Column()
  zip!: string;

  @Column()
  phone!: string;

  @Column()
  email!: string;

  @Column({ nullable: true })
  website!: string;

  @Column('text', {
    array: true,
    nullable: true,
  })
  images!: string[];

  @Column('text')
  description!: string;

  @Column()
  openingTime!: string;

  @Column()
  closingTime!: string;

  @Column('decimal', {
    precision: 10,
    scale: 7,
    nullable: true,
  })
  latitude!: number;

  @Column('decimal', {
    precision: 10,
    scale: 7,
    nullable: true,
  })
  longitude!: number;

  @OneToMany(() => Sheet, (sheet) => sheet.library, {
    cascade: true,
  })
  sheets!: Sheet[];

  @OneToMany(() => LibraryPrice, (pricing) => pricing.library, {
    cascade: true,
  })
  pricingPlans!: LibraryPrice[];

  @OneToMany(() => LibraryFeature, (feature) => feature.library, {
    cascade: true,
  })
  features!: LibraryFeature[];

  @OneToMany(() => User, (user) => user.library)
  users!: User[];

  @OneToMany(() => Booking, (booking) => booking.library)
  bookings!: Booking[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
