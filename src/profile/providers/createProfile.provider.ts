import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateProfileDto } from '../dto/create-profile.dto';
import { PrismaService } from 'src/prismaModule/prisma.service';
import axios from 'axios';
import { format, parse } from 'date-fns';

@Injectable()
export class CreateProfileProvider {
  constructor(private readonly prismaService: PrismaService) {}

  // Helper method to format prayer times into Date objects
  private formatPrayerTime(date: string, time: string): Date {
    return parse(`${date} ${time}`, 'yyyy-MM-dd HH:mm', new Date());
  }

  async createProfile(createProfileDto: CreateProfileDto, user: any) {
    // check if user is authorized to create a profile
    const isSameUser = user.userId === createProfileDto.userId;
    if (!isSameUser) {
      throw new BadRequestException(
        'Unauthorized to create or update profile for another user',
      );
    }

    // check if profile already exists for this user
    const profileAlreadyExist = await this.prismaService.profile.findFirst({
      where: { userId: createProfileDto.userId },
      select: { id: true },
    });

    if (profileAlreadyExist) {
      throw new BadRequestException('Profile already exists for this user');
    }

    // Start a transaction for both profile creation and prayer timings insertion
    const transaction = await this.prismaService.$transaction(
      async (prisma) => {
        // create the profile
        const createProfile = await prisma.profile.create({
          data: {
            username: createProfileDto.username,
            gender: createProfileDto.gender,
            userId: createProfileDto.userId,
            latitude: createProfileDto.latitude,
            longitude: createProfileDto.longitude,
            familyName: createProfileDto.familyName,
            picture: createProfileDto.picture,
            givenName: createProfileDto.givenName,
          },
        });

        if (!createProfile) {
          throw new InternalServerErrorException('Profile creation failed');
        }

        // fetch prayer timings based on the profile's latitude and longitude
        const today = format(new Date(), 'yyyy-MM-dd'); // current date in yyyy-MM-dd format
        const url = `http://api.aladhan.com/v1/timings/${today}?latitude=${createProfile.latitude}&longitude=${createProfile.longitude}&method=2`;

        let prayerTiming;
        try {
          const response = await axios.get(url);
          prayerTiming = response.data.data.timings;
        } catch (error) {
          throw new InternalServerErrorException(
            'Failed to fetch prayer timings',
          );
        }

        // Format prayer times using the helper method
        const prayerTimes = {
          fajr: this.formatPrayerTime(today, prayerTiming?.Fajr),
          dhuhr: this.formatPrayerTime(today, prayerTiming?.Dhuhr),
          asr: this.formatPrayerTime(today, prayerTiming?.Asr),
          maghrib: this.formatPrayerTime(today, prayerTiming?.Maghrib),
          isha: this.formatPrayerTime(today, prayerTiming?.Isha),
          sunrise: this.formatPrayerTime(today, prayerTiming?.Sunrise),
          sunset: this.formatPrayerTime(today, prayerTiming?.Sunset),
          imsak: this.formatPrayerTime(today, prayerTiming?.Imsak),
          midnight: this.formatPrayerTime(today, prayerTiming?.Midnight),
        };

        // Save the prayer timings to the database within the same transaction
        const savePrayerTiming = await prisma.prayerTimings.create({
          data: {
            fajr: prayerTimes.fajr,
            dhuhr: prayerTimes.dhuhr,
            asr: prayerTimes.asr,
            maghrib: prayerTimes.maghrib,
            isha: prayerTimes.isha,
            sunrise: prayerTimes.sunrise,
            sunset: prayerTimes.sunset,
            imsak: prayerTimes.imsak,
            midnight: prayerTimes.midnight,
            profileId: createProfile.id,
          },
        });

        return savePrayerTiming;
      },
    );

    return transaction;
  }
}
