import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum PlanType {
  HOURS = 'HOURS',
  DAYS = 'DAYS',
  MONTH = 'MONTH',
  YEARS = 'YEARS',
}

export class CreateLibraryPriceDto {
  @IsUUID()
  @IsNotEmpty()
  libraryId!: string;

  @IsString()
  @IsNotEmpty()
  planName!: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  durationValue!: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price!: number;

  @IsString()
  @IsOptional()
  slotType?: string;

  @IsString()
  @IsOptional()
  startTime?: string;

  @IsString()
  @IsOptional()
  endTime?: string;

  @IsEnum(PlanType)
  @IsNotEmpty()
  type!: PlanType;
}