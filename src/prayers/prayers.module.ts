import { Module } from '@nestjs/common';
import { PrayersService } from './prayers.service';
import { PrayersController } from './prayers.controller';
import { CreatePrayerProvider } from './providers/createPrayer.provider';

@Module({
  controllers: [PrayersController],
  providers: [PrayersService, CreatePrayerProvider],
})
export class PrayersModule {}
