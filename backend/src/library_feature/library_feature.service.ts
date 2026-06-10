import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { In, Repository } from 'typeorm';
import { LibraryFeature } from './entities/library_feature.entity';
import { CreateLibraryFeatureDto } from './dto/create-library_feature.dto';
import { UpdateLibraryFeatureDto } from './dto/update-library_feature.dto';
import { Library } from 'src/librarys/entities/library.entity';

@Injectable()
export class LibraryFeatureService {
  constructor(
    @InjectRepository(LibraryFeature)
    private readonly libraryFeatureRepo: Repository<LibraryFeature>,

    @InjectRepository(Library)
    private readonly libraryRepo: Repository<Library>,
  ) {}

  async create(createLibraryFeatureDto: CreateLibraryFeatureDto) {
    const feature = this.libraryFeatureRepo.create(createLibraryFeatureDto);

    return await this.libraryFeatureRepo.save(feature);
  }

  async findAll(req:any) {
    const libraries = await this.libraryRepo.find({
      where: {
        adminId: req.admins?.id,
      },
    });
    const libraryIds = libraries.map((library) => library.id);
    const features = await this.libraryFeatureRepo.find({
      where: { libraryId: In(libraryIds) },
    });
    return {
      message: 'All features fetched successfully',
      data: features,
    };
  }

  async findOne(id: string) {
    return await this.libraryFeatureRepo.findOne({
      where: { id },
    });
  }

  async findByLibraryId (id:string){
    const features = await this.libraryFeatureRepo.find({
      where :{libraryId :id}
    })

    return{
      message :"Fetch all Features",
      data : features
    }
  }

  async update(id: string, updateLibraryFeatureDto: UpdateLibraryFeatureDto) {
    await this.libraryFeatureRepo.update(id, updateLibraryFeatureDto);

    return await this.findOne(id);
  }

  async remove(id: string) {
    await this.libraryFeatureRepo.delete(id);

    return {
      message: 'Library feature deleted successfully',
    };
  }
}