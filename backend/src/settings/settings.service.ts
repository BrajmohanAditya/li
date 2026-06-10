import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Setting } from './entities/setting.entity';
import { In, Repository } from 'typeorm';
import { Library } from 'src/librarys/entities/library.entity';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Setting)
    private readonly settingRepo: Repository<Setting>,

    @InjectRepository(Library)
    private readonly libraryRepo: Repository<Library>,
  ) {}

  async create(createSettingDto: CreateSettingDto) {
    
    const setting = this.settingRepo.create(createSettingDto);
    const data = await this.settingRepo.save(setting);

    return {
      message: 'Setting created successfully',
      data,
    };
  }

  async findAll(req: any) {
    const libraries = await this.libraryRepo.find({
      where: {
        adminId: req.admins?.id,
      },
    });

    const libraryIds = libraries.map((library) => library.id);

    const settings = await this.settingRepo.find({
      where: {
        library: {
          id: In(libraryIds),
        },
      },
     
    });

    return {
      message: 'Fetch all settings',
      data: settings,
    };
  }

  async findOne(id: string) {
    const setting = await this.settingRepo.findOne({
      where: { id },
     
    });

    if (!setting) {
      throw new NotFoundException('Setting not found');
    }

    return {
      message: 'Setting fetched successfully',
      data: setting,
    };
  }

  async update(
    id: string,
    updateSettingDto: UpdateSettingDto,
  ) {
    const setting = await this.settingRepo.findOne({
      where: { id },
    });

    if (!setting) {
      throw new NotFoundException('Setting not found');
    }

    Object.assign(setting, updateSettingDto);

    const updatedSetting =
      await this.settingRepo.save(setting);

    return {
      message: 'Setting updated successfully',
      data: updatedSetting,
    };
  }

  async remove(id: string) {
    const setting = await this.settingRepo.findOne({
      where: { id },
    });

    if (!setting) {
      throw new NotFoundException('Setting not found');
    }

    await this.settingRepo.remove(setting);

    return {
      message: 'Setting deleted successfully',
    };
  }
}