import { Controller } from '@nestjs/common';
import { PrayertimingsService } from './prayertimings.service';

@Controller('prayertimings')
export class PrayertimingsController {
  constructor(private readonly prayertimingsService: PrayertimingsService) {}
}
