import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Setting } from './entities/setting.entity';
import { Library } from 'src/librarys/entities/library.entity';

@Module({
  imports :[TypeOrmModule.forFeature([Setting , Library])],
  controllers: [SettingsController],
  providers: [SettingsService],
})
export class SettingsModule {}
