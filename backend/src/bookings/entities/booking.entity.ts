import { Library } from 'src/librarys/entities/library.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @Column({nullable: true})
  libraryId!: string;

  @ManyToOne(() => Library, (library) => library.bookings)
  library!: Library;

  @Column()
  sheetId!: string;

  @Column()
  planId!: string;
  @Column()
  featureId!: string;

  @Column({ type: 'timestamp' })
  startTime!: Date;

  @Column({ type: 'timestamp' })
  endTime!: Date;

  @Column({
    default: 'ACTIVE',
  })
  status!: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';

  @Column()
  paymentStatus!: 'SUCCESS' | 'PENDING';

  @Column({
    nullable: true,
  })
  paymentId!: string;

  @Column({
    default: 'ONLINE',
  })
  bookingType!: string;

  @CreateDateColumn()
createdAt!: Date;



}