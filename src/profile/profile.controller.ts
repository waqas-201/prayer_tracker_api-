import { Controller, Get, Post, Body, Version } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';

import { CurrentUser } from 'src/decorators/currentUser';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Version('1')
  @Post()
  async create(
    @Body() createProfileDto: CreateProfileDto,
    @CurrentUser() user: any,
  ) {
    return await this.profileService.create(createProfileDto, user);
  }
}
