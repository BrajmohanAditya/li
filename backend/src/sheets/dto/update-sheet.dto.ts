import { PartialType } from '@nestjs/mapped-types';
import { CreateSheetDto } from './create-sheet.dto';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateSheetDto extends PartialType(CreateSheetDto) {
  @IsOptional()
  @IsString()
  sheetNumber?: string;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}
