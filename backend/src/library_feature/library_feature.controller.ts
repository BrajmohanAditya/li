import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { LibraryFeatureService } from './library_feature.service';
import { CreateLibraryFeatureDto } from './dto/create-library_feature.dto';
import { UpdateLibraryFeatureDto } from './dto/update-library_feature.dto';

@Controller('library-feature')
export class LibraryFeatureController {
  constructor(private readonly libraryFeatureService: LibraryFeatureService) { }

  @Post()
  create(@Body() createLibraryFeatureDto: CreateLibraryFeatureDto) {
    return this.libraryFeatureService.create(createLibraryFeatureDto);
  }

  @Get()
  findAll() {
    return this.libraryFeatureService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.libraryFeatureService.findOne(id);
  }

  @Get('libraryId/:id')
  findByLibraryId(@Param('id') id: string) {
    return this.libraryFeatureService.findByLibraryId(id)

  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateLibraryFeatureDto: UpdateLibraryFeatureDto) {
    return this.libraryFeatureService.update(id, updateLibraryFeatureDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.libraryFeatureService.remove(id);
  }
}
