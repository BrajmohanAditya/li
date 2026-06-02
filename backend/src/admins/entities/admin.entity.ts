import { Library } from "src/librarys/entities/library.entity"
import { Column } from "typeorm/browser/decorator/columns/Column.js"
import { PrimaryGeneratedColumn } from "typeorm/browser/decorator/columns/PrimaryGeneratedColumn.js"
import { Entity } from "typeorm/browser/decorator/entity/Entity.js"
import { OneToMany } from "typeorm/browser/decorator/relations/OneToMany.js"
@Entity('admins')
export class Admin {
    @PrimaryGeneratedColumn('uuid')
    id!: string
    @Column()
    name!: string
    @Column()
    email!: string
    @Column()
    password!: string

    @Column({ nullable: true })
    number!: string

    @Column({ nullable: true })
    image!: string

   
}
