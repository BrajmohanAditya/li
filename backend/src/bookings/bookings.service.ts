import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { LessThan, Repository } from 'typeorm';
import { LibraryPrice } from 'src/library_price/entities/library_price.entity';
import { Library } from 'src/librarys/entities/library.entity';
import { Sheet } from 'src/sheets/entities/sheet.entity';
import { User } from 'src/users/entities/user.entity';

import { Cron } from '@nestjs/schedule';
import { LibraryFeature } from 'src/library_feature/entities/library_feature.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
    @InjectRepository(LibraryPrice)
    private readonly planRepo: Repository<LibraryPrice>,
    @InjectRepository(Library)
    private readonly libraryRepo: Repository<Library>,
    @InjectRepository(Sheet)
    private readonly sheetRepo: Repository<Sheet>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(LibraryFeature)
    private readonly featureRepo: Repository<LibraryFeature>,
  ) { }

  @Cron('*/1 * * * *')
  async expiredBookings() {
    const now = new Date();

    const expiredDateBookings = await this.bookingRepo.find({
      where: { endTime: LessThan(now), status: 'ACTIVE' },
    });
    for (const booking of expiredDateBookings) {
      booking.status = "EXPIRED";

      await this.bookingRepo.save(booking);

      await this.sheetRepo.update({
        id: booking.sheetId
      }, { isAvailable: true })
    }
  }

  async create(dto: CreateBookingDto) {
    const plan = await this.planRepo.findOne({
      where: {
        id: dto.planId,
      },
    });

    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    const library = await this.libraryRepo.findOne({
      where: {
        id: dto.libraryId,
      },
    });

    if (!library) {
      throw new NotFoundException(
        'Library not found or you do not have permission',
      );
    }

    const sheet = await this.sheetRepo.findOne({
      where: {
        id: dto.sheetId,
      },
    });

    if (!sheet) {
      throw new NotFoundException('Sheet not found');
    }

    if (!sheet.isAvailable) {
      throw new BadRequestException('Sheet already booked');
    }

    const startTime = new Date();
    const endTime = new Date(startTime);
    if (plan.type === 'HOURS') {
      endTime.setHours(endTime.getHours() + plan.durationValue);
    }

    if (plan.type === 'DAYS') {
      endTime.setDate(endTime.getDate() + plan.durationValue);
    }

    if (plan.type === 'MONTH') {
      endTime.setMonth(endTime.getMonth() + plan.durationValue);
    }

    const booking = this.bookingRepo.create({
      ...dto,
      startTime,
      endTime,
      status: 'ACTIVE',
      paymentStatus: 'SUCCESS',
      bookingType: 'OFFLINE',
    });

    const savedBooking = await this.bookingRepo.save(booking);
    sheet.isAvailable = false;
    await this.sheetRepo.save(sheet);
    return {
      message: 'Manual booking created successfully',

      data: savedBooking,
    };
  }

  async findAll() {
    return await this.bookingRepo.find();
  }

  async findBookingByLibraryId(libraryId: string) {
    const library = await this.libraryRepo.findOne({
      where: {
        id: libraryId,
      },
    });

    if (!library) {
      throw new NotFoundException('Library not found');
    }

    const bookings = await this.bookingRepo.find({
      where: {
        libraryId,
      },
    });

    const formattedData = await Promise.all(
      bookings.map(async (booking) => {
        const sheet = await this.sheetRepo.findOne({
          where: {
            id: booking.sheetId,
          },
        });

        const plan = await this.planRepo.findOne({
          where: {
            id: booking.planId,
          },
        });

        const library = await this.libraryRepo.findOne({
          where: {
            id: booking.libraryId,
          },
        });

        const features = await this.featureRepo.find({
          where: {
            libraryId: booking.libraryId,
          },
        });

        return {
          booking: {
            bookingId: booking.id,
            bookingType: booking.bookingType,
            paymentId: booking.paymentId,
            status: booking.status,
            paymentStatus: booking.paymentStatus,
            startTime: booking.startTime,
            endTime: booking.endTime,
          },

          library: library
            ? {
              libraryId: library.id,
              libraryName: library.name,
            }
            : null,

          sheet: sheet
            ? {
              sheetId: sheet.id,
              sheetNumber: sheet.sheetNumber,
            }
            : null,

          plan: plan
            ? {
              planId: plan.id,
              planName: plan.planName,
              type: plan.type,
              durationValue: plan.durationValue,
              price: plan.price,
            }
            : null,

          features: features.map((item) => item.featureName),
        };
      }),
    );

    return {
      message: 'User bookings retrieved successfully',
      totalBookings: formattedData.length,
      data: formattedData,
    };
  }

  async createManualBooking(dto: CreateBookingDto) {
    const plan = await this.planRepo.findOne({
      where: {
        id: dto.planId,
      },
    });

    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    const library = await this.libraryRepo.findOne({
      where: {
        id: dto.libraryId,
       
      },
    });

    if (!library) {
      throw new NotFoundException(
        'Library not found or you do not have permission',
      );
    }

    const sheet = await this.sheetRepo.findOne({
      where: {
        id: dto.sheetId,
      },
    });

    if (!sheet) {
      throw new NotFoundException('Sheet not found');
    }

    if (!sheet.isAvailable) {
      throw new BadRequestException('Sheet already booked');
    }

    const startTime = new Date();
    const endTime = new Date(startTime);
    if (plan.type === 'HOURS') {
      endTime.setHours(endTime.getHours() + plan.durationValue);
    }

    if (plan.type === 'DAYS') {
      endTime.setDate(endTime.getDate() + plan.durationValue);
    }

    if (plan.type === 'MONTH') {
      endTime.setMonth(endTime.getMonth() + plan.durationValue);
    }

    const booking = this.bookingRepo.create({
      ...dto,
      startTime,
      endTime,
      status: 'ACTIVE',
      paymentStatus: 'SUCCESS',
      bookingType: 'OFFLINE',
    });

    const savedBooking = await this.bookingRepo.save(booking);
    sheet.isAvailable = false;
    await this.sheetRepo.save(sheet);
    return {
      message: 'Manual booking created successfully',

      data: savedBooking,
    };
  }

  async findOne(id: string) {
    return await this.bookingRepo.findOne({
      where: { id },
    });
  }

  async update(id: string, updateBookingDto: UpdateBookingDto) {
    await this.bookingRepo.update(id, updateBookingDto);

    return await this.findOne(id);
  }

  async remove(id: string) {
    await this.bookingRepo.delete(id);

    return {
      message: 'Booking deleted successfully',
    };
  }
}
