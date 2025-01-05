import { Injectable } from '@nestjs/common';
import { CreatePrayerDto } from './dto/create-prayer.dto';
import { UpdatePrayerDto } from './dto/update-prayer.dto';
import { PrismaService } from 'src/prismaModule/prisma.service';

@Injectable()
export class PrayersService {
  constructor(private prismaService: PrismaService) {}

  async create(createPrayerDto: CreatePrayerDto) {}

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
