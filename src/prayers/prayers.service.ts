import { Injectable } from '@nestjs/common';
import { CreatePrayerDto } from './dto/create-prayer.dto';
import { UpdatePrayerDto } from './dto/update-prayer.dto';
import { PrismaService } from 'src/prismaModule/prisma.service';
import { CreatePrayerProvider } from './providers/createPrayer.provider';

@Injectable()
export class PrayersService {
  constructor(private readonly createPrayerProvider: CreatePrayerProvider) {}

  async create(createPrayerDto: CreatePrayerDto, user: any) {
    return await this.createPrayerProvider.createPrayer(createPrayerDto, user);
  }

  findAll() {
    return `This action returns all prayers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} prayer`;
  }

  update(id: number, updatePrayerDto: UpdatePrayerDto) {
    return `This action updates a #${id} prayer`;
  }

  remove(id: number) {
    return `This action removes a #${id} prayer`;
  }
}
