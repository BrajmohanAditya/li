import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Req,
  UseInterceptors,
  UploadedFiles,
  Query,
} from '@nestjs/common';
import { LibrarysService } from './librarys.service';
import { CreateLibraryDto } from './dto/create-library.dto';
import { UpdateLibraryDto } from './dto/update-library.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('librarys')
export class LibrarysController {
  constructor(private readonly librarysService: LibrarysService) { }

  @Post()
  @UseInterceptors(FilesInterceptor('images', 5))
  create(
    @Body() createLibraryDto: CreateLibraryDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: any,
  ) {
    const adminId = req.admins?.id;

    return this.librarysService.create(
      createLibraryDto,
      files,
      adminId,
    );
  }

  @Get()
  findAll(
    @Req() req: any,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
      const adminId = req.admins?.id;

    return this.librarysService.findAll(
      adminId,
      parseInt(page),
      parseInt(limit),
    );
  }

  @Get('details')
  findAllShortData(@Req() req: any) {
      const adminId = req.admins?.id;

    return this.librarysService.findAllShortData(adminId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
      const adminId = req.admins?.id;

    return this.librarysService.findOne(id, adminId);
  }

  @Post(':libraryId/assign-admin/:adminId')
  assignLibraryToAdmin(
    @Param('libraryId') libraryId: string,
    @Param('adminId') adminId: string,
  ) {
    return this.librarysService.assignLibraryToAdmin(
      libraryId,
      adminId,
    );
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateLibraryDto: UpdateLibraryDto,
    @Req() req: any,
  ) {
     const adminId = req.admins?.id;

    return this.librarysService.update(
      id,
      adminId,
      updateLibraryDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
     const adminId = req.admins?.id;

    return this.librarysService.remove(id, adminId);
  }
}