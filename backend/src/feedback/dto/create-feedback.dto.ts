import { IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";

export class CreateFeedbackDto {
  @IsUUID()
  @IsNotEmpty()
  userId!: string;

  @IsUUID()
  @IsNotEmpty()
  libraryId!: string;

  @IsNumber()
  @IsNotEmpty()
  rating!: number;

  @IsString()
  @IsNotEmpty()
  message!: string;
}