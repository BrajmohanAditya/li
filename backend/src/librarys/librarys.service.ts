import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Library } from './entities/library.entity';
import { CreateLibraryDto } from './dto/create-library.dto';
import { UpdateLibraryDto } from './dto/update-library.dto';
import { S3Service } from 'src/common/s3/s3.service';

@Injectable()
export class LibrarysService {
  constructor(
    @InjectRepository(Library)
    private readonly libraryRepository: Repository<Library>,
    private readonly s3Service: S3Service,
  ) {}

  async create(
    createLibraryDto: CreateLibraryDto,
    files: Express.Multer.File[],
    adminId: string,
  ) {
    let imageUrls: string[] = [];

    if (files && files.length > 0) {
      imageUrls = await Promise.all(
        files.map((file) => this.s3Service.uploadFile(file, 'libraries')),
      );
    }

    const library = this.libraryRepository.create({
      ...createLibraryDto,
      images: imageUrls,
      admin: { id: adminId },
    });

    const data = await this.libraryRepository.save(library);

    return {
      message: 'Library created successfully',
      data,
    };
  }

  async findAll(adminId: string) {
    const data = await this.libraryRepository.find({
      where: { admin: { id: adminId } },
      relations: ['sheets'],
    });

    return {
      message: 'Libraries retrieved successfully',
      data,
    };
  }

  async findOne(id: string, adminId: string) {
    const data = await this.libraryRepository.findOne({
      where: { id, admin: { id: adminId } },
      relations: ['sheets'],
    });

    if (!data) {
      return {
        message: 'Library not found or you do not have permission',
      };
    }

    return {
      message: 'Library retrieved successfully',
      data,
    };
  }

  async update(
    id: string,
    updateLibraryDto: UpdateLibraryDto,
    adminId: string,
  ) {
    const library = await this.libraryRepository.findOne({
      where: { id, admin: { id: adminId } },
    });

    if (!library) {
      return {
        message: 'Library not found or you do not have permission',
      };
    }

    await this.libraryRepository.update(id, updateLibraryDto);

    const updatedLibrary = await this.libraryRepository.findOne({
      where: { id },
    });

    return {
      message: 'Library updated successfully',
      data: updatedLibrary,
    };
  }

  async remove(id: string, adminId: string) {
    const library = await this.libraryRepository.findOne({
      where: { id, admin: { id: adminId } },
    });

    if (!library) {
      return {
        message: 'Library not found or you do not have permission',
      };
    }

    await this.libraryRepository.delete(id);

    return {
      message: 'Library removed successfully',
    };
  }

  async findNearestLibraries(
    latitude: number,
    longitude: number,
    radius: number = 5,
  ) {
    const query = `
    (
      6371 *
      acos(
        cos(radians(:latitude)) *
        cos(radians(library.latitude)) *
        cos(radians(library.longitude) - radians(:longitude)) +
        sin(radians(:latitude)) *
        sin(radians(library.latitude))
      )
    )
  `;

    const libraries = await this.libraryRepository
      .createQueryBuilder('library')
      .addSelect(query, 'distance')
      .where(`${query} <= :radius`)
      .setParameters({
        latitude,
        longitude,
        radius,
      })
      .orderBy('distance', 'ASC')
      .getRawAndEntities();

    return {
      message: `Libraries within ${radius} KM fetched successfully`,
      totalLibraries: libraries.entities.length,

      data: libraries.entities.map((library, index) => ({
        id: library.id,
        name: library.name,
        address: library.address,
        city: library.city,

        distance: Number(libraries.raw[index].distance).toFixed(2) + ' KM',
      })),
    };
  }
}
