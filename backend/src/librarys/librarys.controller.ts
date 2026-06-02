import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UploadedFile, UseInterceptors, Req, UploadedFiles } from '@nestjs/common';
import { LibrarysService } from './librarys.service';
import { CreateLibraryDto } from './dto/create-library.dto';
import { UpdateLibraryDto } from './dto/update-library.dto';
import {  FilesInterceptor } from '@nestjs/platform-express';


@Controller('librarys')
export class LibrarysController {
  constructor(private readonly librarysService: LibrarysService) { }

  @Post()
  @UseInterceptors(FilesInterceptor('image' ,5))
  create(
    @Req() req: any,
    @Body() createLibraryDto: CreateLibraryDto,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    const adminId = req.admins.id;
    return this.librarysService.create(createLibraryDto, files, adminId);
  }

  @Get()
  findAll(@Req() req: any) {
    const adminId = req.admins.id;
    return this.librarysService.findAll(adminId);
  }

  @Get('/details')
  findAllShortData(@Req() req: any) {
    const adminId = req.admins.id;
    return this.librarysService.findAllShortData(adminId);
  }

  @Get('/nearest')
  findNearestLibraries(
    @Query('latitude') latitude: number,
    @Query('longitude') longitude: number,
    @Query('radius') radius: number,
  ) {
    return this.librarysService.findNearestLibraries(
      Number(latitude),
      Number(longitude),
      Number(radius),
    );
  }

  @Get(':id')
  findOne(@Req() req: any, @Param('id') id: string) {
    const adminId = req.admins.id;
    return this.librarysService.findOne(id, adminId);
  }

  @Patch(':id')
  update(@Req() req: any, @Param('id') id: string, @Body() updateLibraryDto: UpdateLibraryDto) {
    const adminId = req.admins.id;
    return this.librarysService.update(id, updateLibraryDto, adminId);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    const adminId = req.admins.id;
    return this.librarysService.remove(id, adminId);
  }
}
