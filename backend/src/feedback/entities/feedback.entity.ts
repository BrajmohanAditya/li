import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "src/users/entities/user.entity";
import { Library } from "src/librarys/entities/library.entity";

@Entity('feedback')
export class Feedback {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column({ type: 'uuid', nullable: true })
    userId!: string

  

    @Column({ type: 'uuid', nullable: true })
    libraryId!: string

    @ManyToOne(() => Library)
    @JoinColumn({ name: 'libraryId' })
    library!: Library

    @Column()
    rating!: number

    @Column({ type: 'text' })
    message!: string

    @CreateDateColumn()
    createdAt!: Date;

}
