import { Injectable } from '@nestjs/common';
import { CreateLibraryDto } from './dto/create-library.dto';
import { UpdateLibraryDto } from './dto/update-library.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Library } from './entities/library.entity';
import { Repository } from 'typeorm';
import { S3Service } from 'src/common/s3/s3.service';

@Injectable()
export class LibrarysService {
  constructor(
    @InjectRepository(Library)
    private readonly libraryRepo: Repository<Library>,
    private readonly s3service: S3Service,
  ) {}

  // =========================
  // CREATE LIBRARY (ADMIN ONLY)
  // =========================
  async create(
    createLibraryDto: any,
    files: Express.Multer.File[],
    adminId: string,
  ) {
    createLibraryDto.latitude = Number(createLibraryDto.latitude);
    createLibraryDto.longitude = Number(createLibraryDto.longitude);

    let imageUrls: string[] = [];

    if (files && files.length > 0) {
      imageUrls = await Promise.all(
        files.map((file) =>
          this.s3service.uploadFile(file, 'libraries'),
        ),
      );
    }

    const library = this.libraryRepo.create({
      ...createLibraryDto,
      images: imageUrls,
      adminId, // ✅ important: ownership
    });

    return await this.libraryRepo.save(library);
  }

  // =========================
  // GET ALL (ONLY LOGGED ADMIN)
  // =========================
  async findAll(adminId: string, page: number = 1, limit: number = 10) {
    const [librarys, total] = await this.libraryRepo.findAndCount({
      where: {
        adminId, // ✅ restrict data per admin
      },
      skip: (page - 1) * limit,
      take: limit,
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      message: 'Fetch All Libraries',
      data: librarys,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  // =========================
  // SHORT DATA (ADMIN FILTER)
  // =========================
  async findAllShortData(adminId: string) {
    const librarys = await this.libraryRepo.find({
      where: { adminId },
      select: {
        id: true,
        name: true,
        address: true,
      },
    });

    return {
      message: 'Fetch All Library ShortData',
      data: librarys,
    };
  }

  // =========================
  // GET ONE (SECURE)
  // =========================
  async findOne(id: string, adminId: string) {
    return await this.libraryRepo.findOne({
      where: {
        id,
        adminId,
      },
    });
  }

  // =========================
  // ASSIGN LIBRARY TO ADMIN
  // =========================
  async assignLibraryToAdmin(libraryId: string, adminId: string) {
    const library = await this.libraryRepo.findOne({
      where: { id: libraryId },
    });

    if (!library) {
      throw new Error('Library not found');
    }

    library.adminId = adminId;

    return await this.libraryRepo.save(library);
  }

  // =========================
  // UPDATE (SECURE)
  // =========================
  async update(
    id: string,
    adminId: string,
    updateLibraryDto: UpdateLibraryDto,
  ) {
    const library = await this.libraryRepo.findOne({
      where: {
        id,
        adminId,
      },
    });

    if (!library) {
      throw new Error('Library not found');
    }

    await this.libraryRepo.update(id, updateLibraryDto);

    return await this.findOne(id, adminId);
  }

  // =========================
  // DELETE (SECURE)
  // =========================
  async remove(id: string, adminId: string) {
    const library = await this.libraryRepo.findOne({
      where: {
        id,
        adminId,
      },
    });

    if (!library) {
      throw new Error('Library not found');
    }

    await this.libraryRepo.delete(id);

    return {
      message: 'Library deleted successfully',
    };
  }
}