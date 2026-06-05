import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  userId!: string;

  @Column({ type: 'uuid', nullable: true })
  libraryId!: string;

  @Column({ type: 'uuid' })
  sheetId!: string;

  @Column({ type: 'uuid' })
  planId!: string;

  @Column({ type: 'uuid', nullable: true })
  featureId!: string;

  @Column({ type: 'timestamp' })
  expiresAt!: Date;

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