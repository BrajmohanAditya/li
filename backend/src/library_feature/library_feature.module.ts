import { Module } from '@nestjs/common';
import { LibraryFeatureService } from './library_feature.service';
import { LibraryFeatureController } from './library_feature.controller';
import { LibraryFeature } from './entities/library_feature.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([LibraryFeature])],
  controllers: [LibraryFeatureController],
  providers: [LibraryFeatureService],
})
export class LibraryFeatureModule {}
