import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLibraryPriceDto } from './dto/create-library_price.dto';
import { UpdateLibraryPriceDto } from './dto/update-library_price.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { LibraryPrice } from './entities/library_price.entity';
import { Library } from 'src/librarys/entities/library.entity';

@Injectable()
export class LibraryPriceService {
  constructor(
    @InjectRepository(LibraryPrice)
    private readonly libraryPriceRepo: Repository<LibraryPrice>,

    @InjectRepository(Library)
    private readonly libraryRepo: Repository<Library>,
  ) {}

  async create(createLibraryPriceDto: CreateLibraryPriceDto) {
    const libraryPrice = this.libraryPriceRepo.create(createLibraryPriceDto);
    return await this.libraryPriceRepo.save(libraryPrice);
  }

  async findAll(req:any) {

    const libraries = await this.libraryRepo.find({
      where: {
        adminId: req.admins?.id,
      },
    });
    const libraryIds = libraries.map((library) => library.id);
    const prices = await this.libraryPriceRepo.find({
      where: { libraryId: In(libraryIds) },
    });
    return {
      message: 'All prices fetched successfully',
      data: prices,
    };
  }

  async findByLibraryId(id: string) {
    const price = await this.libraryPriceRepo.find({
      where: { libraryId: id },
    });

    if (!price.length) {
      throw new NotFoundException(`No pricing found for library ${id}`);
    }

    return {
      message: 'Prices fetched successfully by libraryId',
      data: price,
    };
  }

  async findOne(id: string) {
    const libraryPrice = await this.libraryPriceRepo.findOne({
      where: { id },
    });

    if (!libraryPrice) {
      throw new NotFoundException(
        `Library Price with ID ${id} not found`,
      );
    }

    return libraryPrice;
  }

  async update(id: string, updateLibraryPriceDto: UpdateLibraryPriceDto) {
    const libraryPrice = await this.findOne(id);

    Object.assign(libraryPrice, updateLibraryPriceDto);

    return await this.libraryPriceRepo.save(libraryPrice);
  }

  async remove(id: string) {
    const libraryPrice = await this.findOne(id);

    await this.libraryPriceRepo.delete(id);

    return {
      message: 'Library price deleted successfully',
    };
  }
}