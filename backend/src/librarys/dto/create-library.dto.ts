export class CreateLibraryDto {}
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsNumber,
  IsOptional,
} from "class-validator";

import { Type } from "class-transformer";

export class CreateLibraryDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  address!: string;

  @IsString()
  @IsNotEmpty()
  city!: string;

  @IsString()
  @IsNotEmpty()
  state!: string;

  @IsString()
  @IsNotEmpty()
  zip!: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsNotEmpty()
  openingTime!: string;

  @IsString()
  @IsNotEmpty()
  closingTime!: string;

  @Type(() => Number)
  @IsNumber()
  latitude!: number;

  @Type(() => Number)
  @IsNumber()
  longitude!: number;
}