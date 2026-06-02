import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  async signup(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);

    const existingUser = await this.userRepository.findOne({ where: { email: createUserDto.email } });

    if (existingUser) {
      throw new BadRequestException("Email already exists");
    }



    const hashPassword = await bcrypt.hash(createUserDto.password, 10);

    user.password = hashPassword;

    const data = await this.userRepository.save(user);



    const { password, ...result } = data;

    return {
      message: "User created successfully",

      data: result
    };


  }

  async findAll() {
    const users = await this.userRepository.find();

    return {
      message: "Get all Users",
      data: users
    }
  }


  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new BadRequestException("User not found");
    }
    const data = await this.userRepository.update(id, updateUserDto);

    return {
      message: "User updated successfully",
      data
    };

  }

  async remove(id: string) {
    const user = this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new BadRequestException("User not found");
    }
    const data = await this.userRepository.delete(id);
    return {
      message: "User removed successfully",
      data
    };
  }
}
