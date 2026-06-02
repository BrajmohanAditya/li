import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Put } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) { }

  @Get()
  findAll() {
    return this.bookingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.bookingsService.findOne(id);
  }

  @Get('library/:libraryId')
  findByLibraryId(@Param('libraryId', ParseUUIDPipe) libraryId: string) {
    return this.bookingsService.findBookingByLibraryId(libraryId);
  }

    @Post('manual')
  createManualBooking(
    
    @Body()
    createBookingDto: CreateBookingDto,
  ) {
    
    return this.bookingsService.createManualBooking(createBookingDto);
  }


  @Put(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingsService.update(id, updateBookingDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.bookingsService.remove(id);
  }
}
