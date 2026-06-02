import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { LibraryPriceService } from './library_price.service';
import { CreateLibraryPriceDto } from './dto/create-library_price.dto';
import { UpdateLibraryPriceDto } from './dto/update-library_price.dto';

@Controller('library-price')
export class LibraryPriceController {
  constructor(private readonly libraryPriceService: LibraryPriceService) {}

  @Post()
  create(@Req() req: any, @Body() createLibraryPriceDto: CreateLibraryPriceDto) {
     const adminId = req.admins.id;
     return this.libraryPriceService.create(createLibraryPriceDto, adminId);
  }


  @Get('/library/:id')
  findOne(@Req() req: any, @Param('id') id: string) {
    const adminId = req.admins.id;
    return this.libraryPriceService.findByLibraryId(id, adminId);
  }

  @Patch(':id')
  update(@Req() req: any, @Param('id') id: string, @Body() updateLibraryPriceDto: UpdateLibraryPriceDto) {
    const adminId = req.admins.id;
    return this.libraryPriceService.update(id, updateLibraryPriceDto, adminId);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    const adminId = req.admins.id;
    return this.libraryPriceService.remove(id, adminId);
  }
}
