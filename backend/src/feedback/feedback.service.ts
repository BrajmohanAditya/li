import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback } from './entities/feedback.entity';
import { User } from 'src/users/entities/user.entity';


@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private feedbackRepository: Repository<Feedback>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  async create(createFeedbackDto: any) {
    const feedback = this.feedbackRepository.create(createFeedbackDto);
    return this.feedbackRepository.save(feedback);
  }

  async findAll() {
    const feedbacks = await this.feedbackRepository.find();

    const users = await this.userRepository.find();

    return feedbacks.map((fb) => {
      const user = users.find((u) => u.id === fb.userId);

      return {
        id: fb.id,
        message: fb.message,
        userId: fb.userId,
        user: user
          ? {
            id: user.id,
            name: user.name,
            email: user.email,
          }
          : null,
        createdAt: fb.createdAt,
      };
    });
  }

  async findByLibraryId(libraryId: string) {
    const feedbacks = await this.feedbackRepository.find({
      where: { libraryId },
    });
    return {
      message: 'Feedbacks for library',
      data: feedbacks,
    }
  }

  async update(id: string, updateFeedbackDto: any) {
    const feedback = await this.feedbackRepository.findOne({
      where: { id },
    });

    if (!feedback) {
      throw new NotFoundException(`Feedback with id ${id} not found`);
    }

    Object.assign(feedback, updateFeedbackDto);

    await this.feedbackRepository.save(feedback);

    return {
      message: 'Feedback updated successfully',
      data: feedback,
    }
  }

  async findOne(id: string) {
    const fb = await this.feedbackRepository.findOne({
      where: { id },
    });

    if (!fb) return null;

    const user = await this.userRepository.findOne({
      where: { id: fb.userId },
    });

    return {
      ...fb,
      user: user
        ? {
          id: user.id,
          name: user.name,
          email: user.email,
        }
        : null,
    };
  }

  async remove(id: string) {
    return this.feedbackRepository.delete(id);
  }
}