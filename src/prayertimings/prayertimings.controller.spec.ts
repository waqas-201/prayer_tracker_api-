import { Test, TestingModule } from '@nestjs/testing';
import { PrayertimingsController } from './prayertimings.controller';
import { PrayertimingsService } from './prayertimings.service';

describe('PrayertimingsController', () => {
  let controller: PrayertimingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrayertimingsController],
      providers: [PrayertimingsService],
    }).compile();

    controller = module.get<PrayertimingsController>(PrayertimingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
