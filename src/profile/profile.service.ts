import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { CreateProfileProvider } from './providers/createProfile.provider';

@Injectable()
export class ProfileService {
  constructor(private readonly createProfileProvider: CreateProfileProvider) {}
  async create(createProfileDto: CreateProfileDto) {
    return await this.createProfileProvider.createProfile(createProfileDto);
  }
}
