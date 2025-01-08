import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { CreateProfileProvider } from './providers/createProfile.provider';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService, CreateProfileProvider],
  imports: [AuthModule],
})
export class ProfileModule {}
