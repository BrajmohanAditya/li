import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Sheet } from './entities/sheet.entity';
import { CreateSheetDto } from './dto/create-sheet.dto';
import { UpdateSheetDto } from './dto/update-sheet.dto';
import { Library } from 'src/librarys/entities/library.entity';

@Injectable()
export class SheetsService {
  constructor(
    @InjectRepository(Sheet)
    private readonly sheetRepo: Repository<Sheet>,

    @InjectRepository(Library)
    private readonly libraryRepository: Repository<Library>,
  ) {}

  async create(createSheetDto: CreateSheetDto) {
    if (!createSheetDto) {
      throw new BadRequestException('Request body is missing');
    }

    const { name, sheetCount, libraryId } = createSheetDto;

    const library = await this.libraryRepository.findOne({
      where: { id: libraryId },
    });

    if (!library) {
      throw new NotFoundException(
        `Library with ID ${libraryId} not found`,
      );
    }

    const sheets: Sheet[] = [];

    for (let i = 1; i <= sheetCount; i++) {
      const sheetNumber = `${name}${i}`;

      const sheet = this.sheetRepo.create({
        sheetNumber,
        libraryId,
      });

      sheets.push(sheet);
    }

    const data = await this.sheetRepo.save(sheets);

    return {
      message: 'Sheets created successfully',
      totalSheets: data.length,
      sheets: data.map((sheet, index) => ({
        sheetId: sheet.id,
        sheetName: name,
        sheetNumber: index + 1,
        fullSheetNumber: sheet.sheetNumber,
        isAvailable: sheet.isAvailable,
      })),
    };
  }

  async findAll(req:any) {
    const libraries = await this.libraryRepository.find({
      where: {
        adminId: req.admins?.id,
      },
    });
    const libraryIds = libraries.map((library) => library.id);
    const sheets = await this.sheetRepo.find({
      where: { libraryId: In(libraryIds) },
    });
    return {
      message: 'All sheets fetched successfully',
      data: sheets,
    };
  }

  async findOne(id: string) {
    const sheet = await this.sheetRepo.findOne({
      where: { id },
    });

    if (!sheet) {
      throw new NotFoundException('Sheet not found');
    }

    return sheet;
  }

  async findByLibraryId(libraryId: string) {
    const sheets = await this.sheetRepo.find({
      where: {
        libraryId,
      },
    });

    return sheets.map((sheet) => ({
      id: sheet.id,
      sheetNumber: sheet.sheetNumber,
      isAvailable: sheet.isAvailable,
    }));
  }

  async update(id: string, updateSheetDto: UpdateSheetDto) {
    const sheet = await this.findOne(id);

    Object.assign(sheet, updateSheetDto);

    return await this.sheetRepo.save(sheet);
  }

  async remove(id: string) {
    const sheet = await this.findOne(id);

    await this.sheetRepo.remove(sheet);

    return {
      message: 'Sheet deleted successfully',
    };
  }
}