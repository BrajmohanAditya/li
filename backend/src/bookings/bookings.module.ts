import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { LibraryFeature } from 'src/library_feature/entities/library_feature.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { Library } from 'src/librarys/entities/library.entity';
import { Sheet } from 'src/sheets/entities/sheet.entity';
import { User } from 'src/users/entities/user.entity';
import { LibraryPrice } from 'src/library_price/entities/library_price.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking , Library , Sheet , User , LibraryFeature  , LibraryPrice])],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
