import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateLibraryFeatureDto {
  @IsUUID()
  @IsNotEmpty()
  libraryId!: string;

  @IsString()
  @IsNotEmpty()
  featureName!: string;
}
