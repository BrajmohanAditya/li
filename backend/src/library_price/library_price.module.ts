import { Module } from '@nestjs/common';
import { LibraryPriceService } from './library_price.service';
import { LibraryPriceController } from './library_price.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibraryPrice } from './entities/library_price.entity';
import { Library } from 'src/librarys/entities/library.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LibraryPrice , Library])],
  controllers: [LibraryPriceController],
  providers: [LibraryPriceService],
})
export class LibraryPriceModule {}
