import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { CreateProfileProvider } from './providers/createProfile.provider';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService, CreateProfileProvider],
})
export class ProfileModule {}
