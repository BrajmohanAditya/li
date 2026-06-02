import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export enum PlanType {
  HOURS = 'HOURS',
  DAYS = 'DAYS',
  MONTH = 'MONTH',
}

export class CreateLibraryPriceDto {
  @IsUUID()
  @IsNotEmpty()
  libraryId!: string;

  @IsString()
  @IsNotEmpty()
  planName!: string;

  @IsString()
  @IsOptional()
  duration?: string;

  @IsNumber()
  @Min(0)
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

  @IsNumber()
  @Min(0)
  durationValue!: number;
}
