import { Library } from "src/librarys/entities/library.entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

export type PlanType = 'HOURS' | 'DAYS' | 'MONTH' | 'YEARS';

@Entity('library_prices')
export class LibraryPrice {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  planName!: string;

  @Column({
    type: 'enum',
    enum: ['HOURS', 'DAYS', 'MONTH', 'YEARS'],
  })
  type!: PlanType;

  @Column({ type: 'int' })
  durationValue!: number;

  @Column({ type: 'uuid' })
  libraryId!: string;

  @Column({ nullable: true })
  slotType!: string;

  @Column({ nullable: true })
  startTime!: string;

  @Column({ nullable: true })
  endTime!: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  price!: number;

  @ManyToOne(() => Library, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'libraryId' })
  library!: Library;
}