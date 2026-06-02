import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { Admin } from 'src/admins/entities/admin.entity';
import { LibraryPrice } from 'src/library_price/entities/library_price.entity';
import { Library } from 'src/librarys/entities/library.entity';
import { Booking } from 'src/bookings/entities/booking.entity';
import { Feedback } from 'src/feedback/entities/feedback.entity';
import { User } from 'src/users/entities/user.entity';
@Module({
  imports: [TypeOrmModule.forFeature([ Admin ,User,
      Booking,
      Feedback,
      Library,
      LibraryPrice, ])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
