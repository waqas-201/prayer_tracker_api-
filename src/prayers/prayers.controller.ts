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
import { Request } from 'express';
import { CurrentUser } from 'src/decorators/currentUser';

@Controller('prayers')
export class PrayersController {
  constructor(private readonly prayersService: PrayersService) {}

  @Version('1')
  @Post()
  async create(
    @Body() createPrayerDto: CreatePrayerDto,
    @CurrentUser() user: any,
  ) {
    return await this.prayersService.create(createPrayerDto, user);
  }

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
