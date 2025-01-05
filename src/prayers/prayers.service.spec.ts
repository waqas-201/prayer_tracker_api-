import { Test, TestingModule } from '@nestjs/testing';
import { PrayersService } from './prayers.service';

describe('PrayersService', () => {
  let service: PrayersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrayersService],
    }).compile();

    service = module.get<PrayersService>(PrayersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
