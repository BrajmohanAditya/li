import { Library } from "src/librarys/entities/library.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('library_features')
export class LibraryFeature {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    featureName!: string;

    @Column({type: 'uuid'})
    libraryId!: string;

    
    @ManyToOne(() => Library, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'libraryId' })
    library!: Library;

    
}