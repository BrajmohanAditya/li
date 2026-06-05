import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLibraryPriceDto } from './dto/create-library_price.dto';
import { UpdateLibraryPriceDto } from './dto/update-library_price.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LibraryPrice } from './entities/library_price.entity';

@Injectable()
export class LibraryPriceService {
  constructor(
    @InjectRepository(LibraryPrice)
    private readonly libraryPriceRepo: Repository<LibraryPrice>,
  ) {}

  async create(createLibraryPriceDto: CreateLibraryPriceDto) {
    const libraryPrice = this.libraryPriceRepo.create(createLibraryPriceDto);
    return await this.libraryPriceRepo.save(libraryPrice);
  }

  async findAll() {
    return await this.libraryPriceRepo.find();
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