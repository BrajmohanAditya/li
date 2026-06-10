
import { IsOptional, IsString } from 'class-validator';

export class UpdateSettingDto {
  @IsOptional()
  razorpayKeyId?: string;

  @IsOptional()
  razorpayKeySecret?: string;

  @IsOptional()
  smsNotificationEnabled?: boolean;

  @IsOptional()
    @IsString()
    libraryId!: string
}