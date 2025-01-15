import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateProfileDto } from '../dto/create-profile.dto';
import { PrismaService } from 'src/prismaModule/prisma.service';
import axios from 'axios';
import { format, parse } from 'date-fns';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CreateProfileProvider {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  // Helper method to format prayer times into Date objects
  private formatPrayerTime(date: string, time: string): Date {
    return parse(`${date} ${time}`, 'yyyy-MM-dd HH:mm', new Date());
  }
  // Helper method to get country from latitude and longitude
  // Helper method to get country from latitude and longitude
  private async getCountry(lat: number, lng: number): Promise<string | null> {
    const key = this.configService.get<string>('OPEN_CAGE_DATA_API_KEY');

    // Dynamically construct the URL with the provided coordinates
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat},${lng}&key=${key}&language=en&pretty=1`;

    try {
      // Sending a GET request to the OpenCage API
      const response = await axios.get(url);

      // If the response is successful, return the country
      const country = response.data.results[0]?.components?.country || null;
      return country;
    } catch (error) {
      console.error('Error fetching OpenCage data:', error);
      return error; // Returning null if there is an error
    }
  }

  private getSchoolOfThought(countryName: string) {
    const hanafiCountries = ['Pakistan', 'Bangladesh', 'India', 'Afghanistan'];
    let schoolOfThought: 'HANAFI' | 'SHAFI';
    if (hanafiCountries.includes(countryName)) {
      schoolOfThought = 'HANAFI';
      return schoolOfThought;
    } else {
      schoolOfThought = 'SHAFI';
      return schoolOfThought;
    }
  }

  private getSchoolCode(school: 'HANAFI' | 'SHAFI') {
    if (school === 'HANAFI') {
      return 1;
    } else {
      return 0;
    }
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
    // get user country information
    const country = await this.getCountry(
      createProfileDto.latitude,
      createProfileDto.longitude,
    );

    const school = this.getSchoolOfThought(country);
    const schoolCode = this.getSchoolCode(school);

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
            schoolOfThought: createProfileDto.schoolOfThought || school,
            country: createProfileDto.country || country,
          },
        });

        if (!createProfile) {
          throw new InternalServerErrorException('Profile creation failed');
        }

        // fetch prayer timings based on the profile's latitude and longitude
        const today = format(new Date(), 'yyyy-MM-dd'); // current date in yyyy-MM-dd format
        const url = `http://api.aladhan.com/v1/timings/${today}?latitude=${createProfile.latitude}&longitude=${createProfile.longitude}&school=${schoolCode}`;

        let prayerTiming;
        try {
          const response = await axios.get(url);
          prayerTiming = response.data.data.timings;
        } catch (error) {
          console.log(error);
        }

        console.log(prayerTiming);

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
        console.log(prayerTimes);

        // Save the prayer timings to the database within the same transaction
        const savePrayerTiming = await prisma.prayerTimings.create({
          data: {
            fajrStart: prayerTimes.fajr,
            fajrEnd: prayerTimes.sunrise,
            dhuhrStart: prayerTimes.dhuhr,
            dhuhrEnd: prayerTimes.asr,
            asrStart: prayerTimes.asr,
            asrEnd: prayerTimes.maghrib,
            maghribStart: prayerTimes.maghrib,
            maghribEnd: prayerTimes.isha,
            ishaStart: prayerTimes.isha,
            ishaEnd: prayerTimes.sunset,
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
