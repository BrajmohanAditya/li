import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import Razorpay from 'razorpay';
import { Booking } from './entities/booking.entity';
import { LibraryPrice } from 'src/library_price/entities/library_price.entity';
import { Sheet } from 'src/sheets/entities/sheet.entity';
import { Library } from 'src/librarys/entities/library.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { LibraryFeature } from 'src/library-feature/entities/library-feature.entity';

@Injectable()
export class BookingsService {
  private razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID as string,

    key_secret: process.env.RAZORPAY_KEY_SECRET as string,
  });

  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(LibraryPrice)
    private readonly planRepo: Repository<LibraryPrice>,
    @InjectRepository(Sheet)
    private readonly sheetRepo: Repository<Sheet>,
    @InjectRepository(Library)
    private readonly libraryRepo: Repository<Library>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(LibraryFeature)
    private readonly featureRepo: Repository<LibraryFeature>,
  ) {}

 

  

 

  async createManualBooking(dto: CreateBookingDto, adminId: string) {
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
        admin: {
          id: adminId,
        },
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

    const booking = this.bookingRepository.create({
      ...dto,
      startTime,
      endTime,
      status: 'ACTIVE',
      paymentStatus: 'SUCCESS',
      bookingType: 'OFFLINE',
    });

    const savedBooking = await this.bookingRepository.save(booking);
    sheet.isAvailable = false;
    await this.sheetRepo.save(sheet);
    return {
      message: 'Manual booking created successfully',

      data: savedBooking,
    };
  }

  async findAll(adminId: string) {
    const bookings = await this.bookingRepository
      .createQueryBuilder('booking')
      .innerJoin('libraries', 'library', 'library.id = booking.libraryId')
      .where('library.adminId = :adminId', { adminId })
      .getMany();

    return {
      message: 'Bookings retrieved successfully',
      data: bookings,
    };
  }

  async findUserById(userId: string) {
    const user = await this.userRepo.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const bookings = await this.bookingRepository.find({
      where: {
        userId,
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

          user: {
            userId: user.id,
            name: user.name,
            email: user.email,
            mobile: user.number,
          },

          library: library
            ? {
                libraryId: library.id,
                libraryName: library.name,
                address: library.address,
                city: library.city,
                state: library.state,
              }
            : null,

          sheet: sheet
            ? {
                sheetId: sheet.id,
                sheetNumber: sheet.sheetNumber,
                isAvailable: sheet.isAvailable,
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
          receipt: {
            receiptNumber: `RCPT-${booking.id.slice(0, 8)}`,
            bookingId: booking.id,
            bookingType: booking.bookingType,
            paymentId: booking.paymentId,
            userName: user.name,
            userEmail: user.email,
            userMobile: user.number,
            libraryName: library?.name,
            libraryAddress: library?.address,
            sheetNumber: sheet?.sheetNumber,
            planName: plan?.planName,
            duration: `${plan?.durationValue} ${plan?.type}`,
            amount: plan?.price,
            paymentStatus: booking.paymentStatus,
            bookingStatus: booking.status,
            startTime: booking.startTime,
            endTime: booking.endTime,
            generatedAt: new Date(),
          },
        };
      }),
    );

    return {
      message: 'User bookings retrieved successfully',
      totalBookings: formattedData.length,
      data: formattedData,
    };
  }

  async extendBooking(bookingId: string, planId: string, adminId: string) {
    const booking = await this.bookingRepository
      .createQueryBuilder('booking')
      .innerJoin('libraries', 'library', 'library.id = booking.libraryId')
      .where('booking.id = :bookingId AND library.adminId = :adminId', {
        bookingId,
        adminId,
      })
      .getOne();

    if (!booking) {
      throw new NotFoundException(
        'Booking not found or you do not have permission',
      );
    }

    const plan = await this.planRepo.findOne({
      where: {
        id: planId,
      },
    });

    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    if (booking.status !== 'ACTIVE') {
      throw new BadRequestException('Cannot extend inactive booking');
    }

    const newEnd = new Date(booking.endTime);

    if (plan.type === 'HOURS') {
      newEnd.setHours(newEnd.getHours() + plan.durationValue);
    }

    if (plan.type === 'DAYS') {
      newEnd.setDate(newEnd.getDate() + plan.durationValue);
    }

    if (plan.type === 'MONTH') {
      newEnd.setMonth(newEnd.getMonth() + plan.durationValue);
    }

    booking.endTime = newEnd;

    const updatedBooking = await this.bookingRepository.save(booking);

    return {
      message: 'Booking extended successfully',

      data: updatedBooking,
    };
  }

  async update(
    id: string,
    updateBookingDto: UpdateBookingDto,
    adminId: string,
  ) {
    const booking = await this.bookingRepository
      .createQueryBuilder('booking')
      .innerJoin('libraries', 'library', 'library.id = booking.libraryId')
      .where('booking.id = :id AND library.adminId = :adminId', { id, adminId })
      .getOne();

    if (!booking) {
      throw new NotFoundException(
        'Booking not found or you do not have permission',
      );
    }

    await this.bookingRepository.update(id, updateBookingDto);

    return {
      message: 'Booking updated successfully',
    };
  }

  async remove(id: string, adminId: string) {
    const booking = await this.bookingRepository
      .createQueryBuilder('booking')
      .innerJoin('libraries', 'library', 'library.id = booking.libraryId')
      .where('booking.id = :id AND library.adminId = :adminId', { id, adminId })
      .getOne();

    if (!booking) {
      throw new NotFoundException(
        'Booking not found or you do not have permission',
      );
    }

    const sheet = await this.sheetRepo.findOne({
      where: {
        id: booking.sheetId,
      },
    });

    if (sheet) {
      sheet.isAvailable = true;

      await this.sheetRepo.save(sheet);
    }

    await this.bookingRepository.delete(id);

    return {
      message: 'Booking removed successfully',
    };
  }
}
