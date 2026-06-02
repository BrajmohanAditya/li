import { IsNotEmpty, IsNumber, IsString, IsUUID, Min } from 'class-validator';

export class CreateSheetDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsNumber()
  @Min(1)
  sheetCount!: number;

  @IsUUID()
  @IsNotEmpty()
  libraryId!: string;
}