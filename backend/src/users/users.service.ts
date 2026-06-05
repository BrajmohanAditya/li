import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { InjectRepository } from '@nestjs/typeorm';

import { User } from './entities/user.entity';

import { Repository } from 'typeorm';

import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) { }

  async create(createUserDto: CreateUserDto) {
    const isMatch = await this.userRepo.findOne({
      where: {
        email: createUserDto.email,
      },
    });

    if (isMatch) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.userRepo.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const data = await this.userRepo.save(user);

    const { password, ...result } = data;

    return {
      message: 'User created successfully',
      data: result,
    };
  }

  async findAll(page = 1, limit = 10) {
    page = Number(page) || 1;
    limit = Number(limit) || 10;

    const total = await this.userRepo.count();
    const totalPages = Math.ceil(total / limit);

    if (page > totalPages) {
      page = totalPages;
    }

    const skip = (page - 1) * limit;

    const [users] = await this.userRepo.findAndCount({
      skip,
      take: limit,
    });

    return {
      message: 'Fetch all users',
      data: users.map(({ password, ...rest }) => rest),
      total

    };
  }

  async findAllUserDetails() {
    const users = await this.userRepo.find();

    const data = users.map(({ password, id, email, name }) => ({
      id,
      email,
      name,
    }));

    return {
      message: 'Fetch all users',
      data,
    };
  }



  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepo.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    await this.userRepo.update(id, updateUserDto);

    const updatedUser = await this.userRepo.findOne({
      where: { id },
    });

    const { password, ...result } = updatedUser!;

    return {
      message: 'User updated successfully',
      data: result,
    };
  }

  async remove(id: string) {
    const user = await this.userRepo.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepo.delete(id);

    return {
      message: 'User deleted successfully',
    };
  }
}
