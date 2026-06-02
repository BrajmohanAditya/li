import { Controller, Get, Post, Body, Param, Delete, ParseUUIDPipe, Put } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  create(@Body() createFeedbackDto: CreateFeedbackDto) {
    return this.feedbackService.create(createFeedbackDto);
  }

  @Get()
  findAll() {
    return this.feedbackService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.feedbackService.findOne(id);
  }

  @Get('library/:libraryId')
  findByLibraryId(@Param('libraryId', ParseUUIDPipe) libraryId: string) {
    return this.feedbackService.findByLibraryId(libraryId);
  }

  @Put(':id')
  update(@Param('id') id:string ,@Body() UpdateFeedbackDto : UpdateFeedbackDto){
    return this.feedbackService.update(id , UpdateFeedbackDto)
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.feedbackService.remove(id);
  }
}
