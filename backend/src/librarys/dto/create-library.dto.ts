import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsUrl,
  IsNumber,
  Matches,
  Length,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLibraryDto {
  @IsNotEmpty()
  @IsString()
  @Length(2, 100)
  name!: string;

  @IsNotEmpty()
  @IsString()
  address!: string;

  @IsNotEmpty()
  @IsString()
  city!: string;

  @IsNotEmpty()
  @IsString()
  state!: string;

  @IsNotEmpty()
  @Matches(/^[0-9]{5,10}$/)
  zip!: string;

  @IsNotEmpty()
  @Matches(/^[0-9]{10}$/)
  phone!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsUrl()
  website!: string;

  // NOTE: 'image' is NOT here because file uploads are handled
  // by Multer via @UploadedFiles() in the controller, not through the body.

  @IsNotEmpty()
  @IsString()
  @Length(10, 1000)
  description!: string;

  @IsNotEmpty()
  @IsString()
  openingTime!: string;

  @IsNotEmpty()
  @IsString()
  closingTime!: string;

  @Type(() => Number)
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude!: number;
}