import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PrismaService } from 'src/prismaModule/prisma.service';

@Injectable()
export class ProfileService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createProfileDto: CreateProfileDto) {
    try {
      await this.prismaService.profile.upsert({
        where: {
          userId: createProfileDto.userId,
        },
        create: {
          username: createProfileDto.username,
          gender: createProfileDto.gender,
          givenName: createProfileDto.givenName,
          familyName: createProfileDto.familyName,
          picture: createProfileDto.picture,
          userId: createProfileDto.userId,
          latitude: createProfileDto.latitude,
          longitude: createProfileDto.longitude,
        },
        update: {
          username: createProfileDto.username,
          gender: createProfileDto.gender,
          givenName: createProfileDto.givenName,
          familyName: createProfileDto.familyName,
          picture: createProfileDto.picture,
          userId: createProfileDto.userId,
          latitude: createProfileDto.latitude,
          longitude: createProfileDto.longitude,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  findAll() {
    return `This action returns all profile`;
  }

  findOne(id: number) {
    return `This action returns a #${id} profile`;
  }

  update(id: number, updateProfileDto: UpdateProfileDto) {
    return `This action updates a #${id} profile`;
  }

  remove(id: number) {
    return `This action removes a #${id} profile`;
  }
}
