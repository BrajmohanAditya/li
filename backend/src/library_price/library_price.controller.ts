import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Put } from '@nestjs/common';
import { LibraryPriceService } from './library_price.service';
import { CreateLibraryPriceDto } from './dto/create-library_price.dto';
import { UpdateLibraryPriceDto } from './dto/update-library_price.dto';

@Controller('library-price')
export class LibraryPriceController {
  constructor(private readonly libraryPriceService: LibraryPriceService) {}

  @Post()
  create(@Body() createLibraryPriceDto: CreateLibraryPriceDto) {
    return this.libraryPriceService.create(createLibraryPriceDto);
  }

  @Get()
  findAll() {
    return this.libraryPriceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.libraryPriceService.findOne(id);
  }

  @Get('library/:libraryId')
  findByLibraryId(@Param('libraryId', ParseUUIDPipe) libraryId: string) {
    return this.libraryPriceService.findByLibraryId(libraryId);
  }

  @Put(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateLibraryPriceDto: UpdateLibraryPriceDto) {
    return this.libraryPriceService.update(id, updateLibraryPriceDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.libraryPriceService.remove(id);
  }
}
