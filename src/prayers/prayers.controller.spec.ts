import { Test, TestingModule } from '@nestjs/testing';
import { PrayersController } from './prayers.controller';
import { PrayersService } from './prayers.service';

describe('PrayersController', () => {
  let controller: PrayersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrayersController],
      providers: [PrayersService],
    }).compile();

    controller = module.get<PrayersController>(PrayersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
