import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ unique: true })
    email!: string;

    @Column()
    password!: string;

    @Column()
    name!: string;

    @Column()
    number!: string;

    @Column()
    state!: string;

    @Column()
    city!: string;

    @Column()
    address!: string;

    @Column()
    gender!: string;

    @Column({ nullable: true })
    imageUrl!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

}
