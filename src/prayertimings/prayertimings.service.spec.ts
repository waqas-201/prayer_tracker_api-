import { Test, TestingModule } from '@nestjs/testing';
import { PrayertimingsService } from './prayertimings.service';

describe('PrayertimingsService', () => {
  let service: PrayertimingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrayertimingsService],
    }).compile();

    service = module.get<PrayertimingsService>(PrayertimingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
