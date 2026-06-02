import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { LoginAdminDto } from './dto/login-admin.dto';

@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) { }

  @Post('signup')
  create(@Body() createAdminDto: CreateAdminDto) {
    
    return this.adminsService.signup(createAdminDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginAdminDto) {
  
    return this.adminsService.login(loginDto.email, loginDto.password);
  }

  @Get('profile')
  profile(@Req() req: any) {
    return this.adminsService.profile(req);
  }

  @Patch('update')
  @UseInterceptors(FileInterceptor('image'))
  update(
   @Req() req:any,

    updateAdminDto: UpdateAdminDto,

    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return this.adminsService.update(req, updateAdminDto, file);
  }
 
}
