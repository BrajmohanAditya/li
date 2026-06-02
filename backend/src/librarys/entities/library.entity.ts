import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('libraries')
export class Library {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    nullable: true,
    default: 'Library',
  })
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

  @Column({
    type: 'uuid',
    nullable: true,
  })
  adminId?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}