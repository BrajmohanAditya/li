import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Put, Req } from '@nestjs/common';
import { SheetsService } from './sheets.service';
import { CreateSheetDto } from './dto/create-sheet.dto';
import { UpdateSheetDto } from './dto/update-sheet.dto';


@Controller('sheets')
export class SheetsController {
  constructor(private readonly sheetsService: SheetsService) {}

  @Post()
  create(@Body() createSheetDto: CreateSheetDto) {
    return this.sheetsService.create(createSheetDto);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.sheetsService.findAll(req);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.sheetsService.findOne(id);
  }

  @Get('library/:libraryId')
  findByLibraryId(@Param('libraryId', ParseUUIDPipe) libraryId: string) {
    return this.sheetsService.findByLibraryId(libraryId);
  }

  @Put(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateSheetDto: UpdateSheetDto) {
    return this.sheetsService.update(id, updateSheetDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.sheetsService.remove(id);
  }
}
