import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateSettingDto {
  @IsOptional()
  @IsString()
  razorpayKeyId?: string;

  @IsOptional()
  @IsString()
  razorpayKeySecret?: string;

  @IsOptional()
  @IsBoolean()
  smsNotificationEnabled?: boolean;

  @IsOptional()
  @IsString()
  libraryId! :string ;
} 