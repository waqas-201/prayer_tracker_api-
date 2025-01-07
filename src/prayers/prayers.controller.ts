import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Version,
  Req,
} from '@nestjs/common';
import { PrayersService } from './prayers.service';
import { CreatePrayerDto } from './dto/create-prayer.dto';
import { UpdatePrayerDto } from './dto/update-prayer.dto';
import { Throttle } from '@nestjs/throttler';
import { Request } from 'express';

const short = {
  default: { limit: 13, ttl: 60000 },
};
@Controller('prayers')
export class PrayersController {
  constructor(private readonly prayersService: PrayersService) {}
  @Throttle({ ...short })
  @Post()
  create(@Body() createPrayerDto: CreatePrayerDto) {
    return createPrayerDto;
  }
  @Version('1')
  @Get()
  findAll(@Req() req: Request) {
    console.log(req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.prayersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePrayerDto: UpdatePrayerDto) {
    return this.prayersService.update(+id, updatePrayerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.prayersService.remove(+id);
  }
}
