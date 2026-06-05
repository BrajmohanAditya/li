import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateSheetDto {
  @IsOptional()
  @IsString()
  sheetNumber?: number;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}