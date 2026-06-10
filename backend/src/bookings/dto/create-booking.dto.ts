import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateBookingDto {
  @IsUUID()
  @IsNotEmpty()
  userId!: string;

  @IsUUID()
  @IsNotEmpty()
  libraryId!: string;

  @IsUUID()
  @IsNotEmpty()
  sheetId!: string;

  @IsUUID()
  @IsNotEmpty()
  planId!: string;

  @IsUUID()
  @IsOptional()
  featureId?: string;

  

  @IsEnum(['ACTIVE', 'EXPIRED', 'CANCELLED'])
  @IsOptional()
  status?: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';

  @IsEnum(['SUCCESS', 'PENDING'])
  @IsOptional()
  paymentStatus?: 'SUCCESS' | 'PENDING';
}