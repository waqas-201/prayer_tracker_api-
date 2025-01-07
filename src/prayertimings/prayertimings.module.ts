import { Module } from '@nestjs/common';
import { PrayertimingsService } from './prayertimings.service';
import { PrayertimingsController } from './prayertimings.controller';

@Module({
  controllers: [PrayertimingsController],
  providers: [PrayertimingsService],
})
export class PrayertimingsModule {}
