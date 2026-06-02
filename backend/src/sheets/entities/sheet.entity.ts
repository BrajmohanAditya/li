import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Library } from 'src/librarys/entities/library.entity';

@Entity('sheets')
export class Sheet {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  sheetNumber!: string;

  @Column({
    default: true,
  })
  isAvailable!: boolean;

 @Column({ type: 'uuid' })
  libraryId!: string;
  
}