import { Injectable } from '@nestjs/common';
import { CreateLibraryPriceDto } from './dto/create-library_price.dto';
import { UpdateLibraryPriceDto } from './dto/update-library_price.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LibraryPrice } from './entities/library_price.entity';
import { Repository } from 'typeorm';
import { Library } from 'src/librarys/entities/library.entity';

@Injectable()
export class LibraryPriceService {
  constructor(
    @InjectRepository(LibraryPrice)
    private readonly libraryPriceRepository: Repository<LibraryPrice>,
    @InjectRepository(Library)
    private readonly libraryRepository: Repository<Library>,
  ) {}

  async create(
    createLibraryPriceDto: CreateLibraryPriceDto,
    adminId: string,
  ) {
    const library = await this.libraryRepository.findOne({
        where: { id: createLibraryPriceDto.libraryId, admin: { id: adminId } },
    });

    if (!library) {
      return {
        message: 'Library not found or you do not have permission',
      };
    }

    const libraryPrice = this.libraryPriceRepository.create(createLibraryPriceDto);

    const data = await this.libraryPriceRepository.save(libraryPrice);

    return {
      message: 'Created successfully',
      data,
    };
  }

 

  async findByLibraryId(id: string, adminId: string) {
    const library = await this.libraryRepository.findOne({
      where: { id, admin: { id: adminId } },
    });

    if (!library) {
      return {
        message: 'Library not found or you do not have permission',
      };
    }

    const data = await this.libraryPriceRepository.find({
      where: {
        library: { id },
      },
    });

    return {
      message: 'Library pricing fetched successfully',
      data,
    };
  }

  async update(
    id: string,
    updateLibraryPriceDto: UpdateLibraryPriceDto,
    adminId: string,
  ) {
    const price = await this.libraryPriceRepository.findOne({
      where: {
        id,
        library: {
          admin: { id: adminId },
        },
      },
    });

    if (!price) {
      return {
        message: 'Pricing plan not found or you do not have permission',
      };
    }

    await this.libraryPriceRepository.update(id, updateLibraryPriceDto);

    const updatedData = await this.libraryPriceRepository.findOne({
      where: { id },
    });

    return {
      message: 'Library price updated successfully',
      data: updatedData,
    };
  }

  async remove(id: string, adminId: string) {
    const price = await this.libraryPriceRepository.findOne({
      where: {
        id,
        library: {
          admin: { id: adminId }  ,
        },
      },
    });

    if (!price) {
      return {
        message: 'Pricing plan not found or you do not have permission',
      };
    }

    await this.libraryPriceRepository.delete(id);

    return {
      message: 'Library price removed successfully',
    };
  }
}