import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { S3Service } from 'src/common/s3/s3.service';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    private readonly s3service: S3Service,
  ) { }
  async signup(createAdminDto: CreateAdminDto) {
    const existingAdmin = await this.adminRepository.findOne({
      where: { email: createAdminDto.email },
    });

    if (existingAdmin) {
      throw new BadRequestException('Admin with this email already exists');
    }
    const admin = this.adminRepository.create(createAdminDto);

    const hashedPassword = await bcrypt.hash(createAdminDto.password, 10);
    admin.password = hashedPassword;
    const data = await this.adminRepository.save(admin);

    const token = jwt.sign(
      { id: data.id, email: data.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '1h' },
    );

    return {
      message: 'Admin created successfully',
      token,
      data: {
        id: data.id,
        name: data.name,
        email: data.email,
      },
    };
  }

  async login(email: string, password: string) {
    const admin = await this.adminRepository.findOne({ where: { email } });
    if (!admin) {
      throw new BadRequestException('Invalid email or password');
    }
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid email or password');
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '1h' },
    );

    return {
      message: 'Login successful',
      token,
      data: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
      },
    };
  }

  async profile(req: any) {
    const admin = await this.adminRepository.findOne({
      where: { id: req.admins.id },
    });
    if (!admin) {
      throw new BadRequestException('Admin not found');
    }

    const { password, ...result } = admin;
    return {
      message: 'Profile retrieved successfully',
      data: result,
    };
  }

  async update(
    req: any,
    updateAdminDto: UpdateAdminDto,
    file: Express.Multer.File,
  ) {

    const id = req.admins.id;

    const isMatch = await this.adminRepository.findOne({
      where: { id },
    });

    if (!isMatch) {
      throw new BadRequestException('admin not found');
    }

    const imageUrl = await this.s3service.uploadFile(file, 'image');

    isMatch.image = imageUrl;

    const udpatedata = await this.adminRepository.update(id, {
      ...updateAdminDto,
      image: imageUrl,
    });

    return udpatedata;
  }


}
