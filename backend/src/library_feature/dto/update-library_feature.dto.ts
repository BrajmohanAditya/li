import { PartialType } from '@nestjs/mapped-types';
import { CreateLibraryFeatureDto } from './create-library_feature.dto';

export class UpdateLibraryFeatureDto extends PartialType(CreateLibraryFeatureDto) {}
