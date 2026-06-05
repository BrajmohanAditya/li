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
    console.log('Cron running:', new Date());

    const now = new Date();

    const expiredBookings = await this.bookingRepo.find({
      where: {
        expiresAt: LessThan(now),
        status: 'ACTIVE',
      },
    });

    console.log('Found:', expiredBookings.length);

    for (const booking of expiredBookings) {
      console.log('Expiring:', booking.id);

      await this.bookingRepo.update(booking.id, {
        status: 'EXPIRED',
      });

      await this.sheetRepo.update(
        { id: booking.sheetId },
        { isAvailable: true },
      );
    }
  }
  async create(dto: CreateBookingDto) {
    const plan = await this.planRepo.findOne({
      where: { id: dto.planId },
    });

    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    const library = await this.libraryRepo.findOne({
      where: { id: dto.libraryId },
    });

    if (!library) {
      throw new NotFoundException('Library not found');
    }

    const sheet = await this.sheetRepo.findOne({
      where: { id: dto.sheetId },
    });

    if (!sheet) {
      throw new NotFoundException('Sheet not found');
    }

    if (!sheet.isAvailable) {
      throw new BadRequestException('Sheet already booked');
    }

    const expiresAt = new Date();

    switch (plan.type) {
      case 'HOURS': {
        if (!plan.endTime) {
          throw new BadRequestException('Plan endTime is required');
        }

        const [hour, minute] = plan.endTime
          .split(':')
          .map(Number);

        expiresAt.setHours(hour, minute, 0, 0);

        // If end time already passed today
        if (expiresAt <= new Date()) {
          throw new BadRequestException(
            'Plan end time has already passed',
          );
        }

        break;
      }

      case 'DAYS': {
        expiresAt.setDate(
          expiresAt.getDate() + Number(plan.durationValue),
        );

        if (plan.endTime) {
          const [hour, minute] = plan.endTime
            .split(':')
            .map(Number);

          expiresAt.setHours(hour, minute, 0, 0);
        }

        break;
      }

      case 'MONTH': {
        expiresAt.setMonth(
          expiresAt.getMonth() + Number(plan.durationValue),
        );

        if (plan.endTime) {
          const [hour, minute] = plan.endTime
            .split(':')
            .map(Number);

          expiresAt.setHours(hour, minute, 0, 0);
        }

        break;
      }

      case 'YEARS': {
        expiresAt.setFullYear(
          expiresAt.getFullYear() + Number(plan.durationValue),
        );

        if (plan.endTime) {
          const [hour, minute] = plan.endTime
            .split(':')
            .map(Number);

          expiresAt.setHours(hour, minute, 0, 0);
        }

        break;
      }

      default:
        throw new BadRequestException('Invalid plan type');
    }

    const booking = this.bookingRepo.create({
      ...dto,
      expiresAt,
      status: 'ACTIVE',
      paymentStatus: 'SUCCESS',
      bookingType: 'OFFLINE',
    });

    const savedBooking = await this.bookingRepo.save(booking);

    await this.sheetRepo.update(
      { id: sheet.id },
      { isAvailable: false },
    );

    return {
      message: 'Booking created successfully',
      data: savedBooking,
    };
  }
  async createManualBooking(dto: CreateBookingDto) {
    return this.create(dto);
  }

  async findAll(page: number = 1, limit: number = 10) {
    const [bookings, totalBookings] = await this.bookingRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    const formattedData = await Promise.all(
      bookings.map(async (booking) => {
        const library = await this.libraryRepo.findOne({
          where: { id: booking.libraryId },
        });

        const sheet = await this.sheetRepo.findOne({
          where: { id: booking.sheetId },
        });

        const plan = await this.planRepo.findOne({
          where: { id: booking.planId },
        });

        const features = await this.featureRepo.find({
          where: { libraryId: booking.libraryId },
        });

        return {
          booking: {
            bookingId: booking.id,
            bookingType: booking.bookingType,
            paymentId: booking.paymentId,
            status: booking.status,
            paymentStatus: booking.paymentStatus,
            expiresAt: booking.expiresAt,
            isExpired: booking.status === 'EXPIRED',
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
              startTime: plan.startTime,
              endTime: plan.endTime,
            }
            : null,

          features: features.map(
            (feature) => feature.featureName,
          ),
        };
      }),
    );

    return {
      message: 'Bookings retrieved successfully',
      totalBookings,
      currentPage: page,
      totalPages: Math.ceil(totalBookings / limit),
      data: formattedData,
    };
  }

  async findBookingByLibraryId(
    libraryId: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const library = await this.libraryRepo.findOne({
      where: { id: libraryId },
    });

    if (!library) {
      throw new NotFoundException('Library not found');
    }

    const [bookings, totalBookings] = await this.bookingRepo.findAndCount({
      where: { libraryId },
      skip: (page - 1) * limit,
      take: limit,
    });

    const formattedData = await Promise.all(
      bookings.map(async (booking) => {
        const sheet = await this.sheetRepo.findOne({
          where: { id: booking.sheetId },
        });

        const plan = await this.planRepo.findOne({
          where: { id: booking.planId },
        });

        const features = await this.featureRepo.find({
          where: { libraryId: booking.libraryId },
        });

        return {
          booking: {
            bookingId: booking.id,
            bookingType: booking.bookingType,
            paymentId: booking.paymentId,
            status: booking.status,
            paymentStatus: booking.paymentStatus,
            expiresAt: booking.expiresAt,
            isExpired: booking.status === 'EXPIRED',
          },

          library: {
            libraryId: library.id,
            libraryName: library.name,
          },

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
              startTime: plan.startTime,
              endTime: plan.endTime,
            }
            : null,

          features: features.map((feature) => feature.featureName),
        };
      }),
    );

    return {
      message: 'User bookings retrieved successfully',
      totalBookings,
      currentPage: page,
      totalPages: Math.ceil(totalBookings / limit),
      data: formattedData,
    };
  }

  async findOne(id: string) {
    const booking = await this.bookingRepo.findOne({
      where: { id },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  async update(id: string, updateBookingDto: UpdateBookingDto) {
    const booking = await this.findOne(id);

    await this.bookingRepo.update(booking.id, updateBookingDto);

    return await this.findOne(id);
  }

  async remove(id: string) {
    const booking = await this.findOne(id);


    if (booking.sheetId) {
      await this.sheetRepo.update(
        { id: booking.sheetId },
        { isAvailable: true },
      );
    }


    await this.bookingRepo.delete(booking.id);

    return {
      message: 'Booking deleted successfully and sheet is now available',
    };
  }
}
