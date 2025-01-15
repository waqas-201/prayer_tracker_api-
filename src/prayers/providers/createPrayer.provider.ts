import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreatePrayerDto } from '../dto/create-prayer.dto';
import { PrismaService } from 'src/prismaModule/prisma.service';
import {
  endOfDay,
  format,
  isAfter,
  isBefore,
  isEqual,
  startOfDay,
} from 'date-fns';
import { Gender, MenPrayerStatus, WomenPrayerStatus } from '@prisma/client';

//get user id from request
// from this user id get profile id
// check user providing profile id is same as we get profile id by logged in user userid
// if not then throw error
// get user gender from profile
// now get for which prayer user is trying to mark status
//  for example if user is trying to mark status for fajr prayer
// check is this time is valid for fajr prayer
// if not then throw error
// now check is this user already marked status for this prayer
// if yes then throw error
// if time is valid and status is not marked then
// get prayer status user is trying to mark
// check user gender has this gender has valid to create  this prayer status
// calculte time  is this time is valid for this status

//----------------------this feature will be implemented later---------------------------
//if gender is men
// 30 minuts ---->  from start prayer time is MEN Prayerstatus = TAKBEERE_E_ULA
// 45 minuts ---->  from start prayer time is MEN Prayerstatus = SALATAL_JAMAAH
// 45+  minuts ---->  from start prayer time is MEN Prayerstatus = INDIVIDUAL_PRAYER
// end time of prayer ----> means user missed the prayer timings to he only can mark status for MISSED_PRAYER
// if gender is women or other
// 30 minuts ---->  from start prayer time is WOMEN Prayerstatus = PRAYED_AT_TIME
// 45 minuts ---->  from start prayer time is WOMEN Prayerstatus = PRAYED_LATE
// 45+  minuts ---->  from start prayer time is WOMEN Prayerstatus = PRAYED_TOO_LATE
// end time of prayer ----> means user missed the prayer timings to he only can mark status for MISSED_PRAYER
//----------------------this feature will be implemented later---------------------------

// if all conditions are valid then create prayer status

@Injectable()
export class CreatePrayerProvider {
  constructor(private readonly prismaService: PrismaService) {}

  private checkProfileIds(
    profileIdFromDb: string,
    userProviderProfileId: string,
  ) {
    // check user providing profile id is same as we get profile id by logged in user userid
    const isUserProvidingProfileIdSameAsLoggedInUser =
      profileIdFromDb === userProviderProfileId;
    // if not then throw error
    if (!isUserProvidingProfileIdSameAsLoggedInUser) {
      throw new BadRequestException(
        'Provided profile id is not same as logged in user profile id',
      );
    }
  }

  private checkIsUserPrayerStatusIsValid(
    gender: Gender,
    statusValue: MenPrayerStatus | WomenPrayerStatus,
  ) {
    if (gender === 'MEN') {
      return Boolean(MenPrayerStatus[statusValue]);
    }
    if (gender === 'WOMEN' || gender === 'OTHER') {
      return Boolean(MenPrayerStatus[statusValue]);
    }
  }

  private async getLoggedInUserTimings(profileId: string) {
    try {
      const loggedInUserPrayerTimings =
        await this.prismaService.prayerTimings.findFirst({
          where: {
            profileId,
          },
        });

      if (!loggedInUserPrayerTimings) {
        // get user location from user profile and fetch prayers and add them into db
        // for now thrwo an error
        throw new InternalServerErrorException('filed to find prayer timings');
      }

      return loggedInUserPrayerTimings;
    } catch (error) {
      throw error;
    }
  }

  private async getUserProfile(userId: string) {
    try {
      const profile = await this.prismaService.profile.findFirst({
        where: { userId: userId },
      });

      if (!profile) {
        throw new BadRequestException('Profile not found');
      }
      return profile;
    } catch (error) {
      throw error;
    }
  }

  //checks in current date user marked prayer if marked  throw error so user can not mark one prayer two times
  private async checkIfPrayerAlreadyMarked(createPrayerDto: CreatePrayerDto) {
    const currentDateAndTime = new Date();
    try {
      const DoseAlreadyMarkedSamePrayer =
        await this.prismaService.prayer.findFirst({
          where: {
            profileId: createPrayerDto.profileId,
            prayerName: createPrayerDto.prayerName,
            createdAt: {
              gte: startOfDay(currentDateAndTime),
              lte: endOfDay(currentDateAndTime),
            },
          },
        });
      // if yes then throw error
      if (DoseAlreadyMarkedSamePrayer) {
        throw new BadRequestException('you already have marked your prayer');
      }

      return DoseAlreadyMarkedSamePrayer;
    } catch (error) {
      throw error;
    }
  }

  async createPrayer(createPrayerDto: CreatePrayerDto, user: any) {
    //get prfileId from request
    // from logged in user  userId get profileId
    // it means one profileId user provided to me and one i got  from logged in user
    const profile = await this.getUserProfile(user.userId);
    // check user providing profile id is same as we get profile id by logged in user userid
    this.checkProfileIds(profile.id, createPrayerDto.profileId);

    const isUserPrayerStatusIsValid = this.checkIsUserPrayerStatusIsValid(
      profile.gender,
      createPrayerDto.prayerStatus,
    );
    if (!isUserPrayerStatusIsValid) {
      throw new BadRequestException('invalid prayer status ');
    }

    // get all prayers by user
    const loggedInUserPrayerTimings = await this.getLoggedInUserTimings(
      profile.id,
    );

    //  now get for which prayer user is trying to mark status
    //  for example if user is trying to mark status for fajr prayer
    // check is this time is valid for fajr prayer
    // Check if the prayer start time has not arrived yet or if the prayer time has ended
    // then get start and end time for this prayer from db
    const startTime =
      loggedInUserPrayerTimings[
        createPrayerDto?.prayerName?.toLocaleLowerCase().concat('Start')
      ];
    const endTime =
      loggedInUserPrayerTimings[
        createPrayerDto?.prayerName?.toLocaleLowerCase().concat('End')
      ];

    const currentDateAndTime = new Date();
    //checks in current date user marked prayer if marked  throw error so user can not mark one prayer two times
    await this.checkIfPrayerAlreadyMarked(createPrayerDto);

    const prayerTimeIsNotStartedYet = isBefore(currentDateAndTime, startTime);
    const prayerTimeHasEnded = isAfter(currentDateAndTime, endTime);
    if (prayerTimeIsNotStartedYet) {
      throw new BadRequestException('prayer time is not started yet ');
    } else if (prayerTimeHasEnded) {
      throw new BadRequestException('you missed the prayer');
    }

    // if time is valid and status is not marked then
    // if all conditions are valid then create prayer status

    const isMen = Boolean(profile.gender === 'MEN');

    const markPrayerStatus = await this.prismaService.prayer.create({
      data: {
        performedAt: currentDateAndTime,
        prayerName: createPrayerDto.prayerName,
        profileId: createPrayerDto.profileId,
        ...(isMen
          ? {
              menStatus: createPrayerDto.prayerStatus as MenPrayerStatus,
            }
          : { womenStatus: createPrayerDto.prayerStatus as WomenPrayerStatus }),
      },
    });

    return markPrayerStatus;
  }
}

