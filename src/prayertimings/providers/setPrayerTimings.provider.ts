import { Injectable } from '@nestjs/common';

@Injectable()
export class SetPrayerTimingsProvider {
  constructor() {
    console.log('SetPrayerTimingsProvider instantiated');
  }
}
