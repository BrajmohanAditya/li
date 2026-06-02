import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';

import { BookingsService } from './bookings.service';

import { CreateBookingDto } from './dto/create-booking.dto';

import { UpdateBookingDto } from './dto/update-booking.dto';

import { VerifyPaymentDto } from './dto/verify-payment.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  

 

  @Post('manual')
  createManualBooking(
    @Req() req: any,
    @Body()
    createBookingDto: CreateBookingDto,
  ) {
    const adminId = req.admins.id;
    return this.bookingsService.createManualBooking(createBookingDto, adminId);
  }

  @Get()
  findAll(@Req() req: any) {
    const adminId = req.admins.id;
    return this.bookingsService.findAll(adminId);
  }

  @Post('extend/:bookingId/:planId')
  extendBooking(
    @Req() req: any,
    @Param('bookingId')
    bookingId: string,

    @Param('planId')
    planId: string,
  ) {
    const adminId = req.admins.id;
    return this.bookingsService.extendBooking(bookingId, planId, adminId);
  }

  @Patch(':id')
  update(
    @Req() req: any,
    @Param('id')
    id: string,

    @Body()
    updateBookingDto: UpdateBookingDto,
  ) {
    const adminId = req.admins.id;
    return this.bookingsService.update(id, updateBookingDto, adminId);
  }

  @Delete(':id')
  remove(
    @Req() req: any,
    @Param('id')
    id: string,
  ) {
    const adminId = req.admins.id;
    return this.bookingsService.remove(id, adminId);
  }
}
