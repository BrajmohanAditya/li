import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Admin } from 'src/admins/entities/admin.entity';
import { User } from 'src/users/entities/user.entity';
import { Booking } from 'src/bookings/entities/booking.entity';
import { Feedback } from 'src/feedback/entities/feedback.entity';
import { Library } from 'src/librarys/entities/library.entity';
import { LibraryPrice } from 'src/library_price/entities/library_price.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepo: Repository<Admin>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,

    @InjectRepository(Feedback)
    private readonly feedbackRepo: Repository<Feedback>,

    @InjectRepository(Library)
    private readonly libraryRepo: Repository<Library>,

    @InjectRepository(LibraryPrice)
    private readonly priceRepo: Repository<LibraryPrice>,
  ) {}

  async getDashboardData(adminId: string) {
    const admin = await this.adminRepo.findOne({
      where: { id: adminId },
    });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    const libraries = await this.libraryRepo.find({
      where: { adminId },
      
    });

    const libraryIds = libraries.map((library) => library.id);

    const totalLibraries = libraryIds.length;

    if (libraryIds.length === 0) {
      return {
        overview: {
          totalUsers: 0,
          totalLibraries: 0,
          totalBookings: 0,
          activeBookings: 0,
          totalRevenue: 0,
        },
        recentBookings: [],
        recentFeedbacks: [],
      };
    }

    const totalUsers = await this.userRepo.count();

    const totalBookings = await this.bookingRepo.count({
      where: {
        libraryId: In(libraryIds),
      },
    });

    const activeBookings = await this.bookingRepo.count({
      where: {
        libraryId: In(libraryIds),
        status: 'ACTIVE',
      },
    });

    const bookings = await this.bookingRepo.find({
      where: {
        libraryId: In(libraryIds),
      },
    });

    let totalRevenue = 0;

    for (const booking of bookings) {
      if (!booking.planId) continue;

      const plan = await this.priceRepo.findOne({
        where: {
          id: booking.planId,
        },
      });

      if (plan) {
        totalRevenue += Number(plan.price);
      }
    }

    const recentBookings = await this.bookingRepo.find({
      where: {
        libraryId: In(libraryIds),
      },
      
      take: 5,
    });

    const recentFeedbacks = await this.feedbackRepo.find({
      where: {
        libraryId: In(libraryIds),
      },
      order: {
        createdAt: 'DESC',
      },
      take: 5,
    });

    return {
      overview: {
        totalUsers,
        totalLibraries,
        totalBookings,
        activeBookings,
        totalRevenue,
      },
      recentBookings,
      recentFeedbacks,
    };
  }
}