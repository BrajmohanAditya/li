import { Admin } from "src/admins/entities/admin.entity";
import { Library } from "src/librarys/entities/library.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('settings')
export class Setting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  razorpayKeyId: string;

  @Column({ nullable: true })
  razorpayKeySecret: string;

  @Column({ default: true })
  smsNotificationEnabled: boolean;

  @ManyToOne(() => Library, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'libraryId' })
  library!: Library;

  @Column({nullable : true})
  libraryId! :string
}