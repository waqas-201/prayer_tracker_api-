import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreatePrayerDto } from '../dto/create-prayer.dto';
import { PrismaService } from 'src/prismaModule/prisma.service';
import { format, isAfter, isBefore, isEqual } from 'date-fns';

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
// if all conditions are valid then create prayer status

@Injectable()
export class CreatePrayerProvider {
  constructor(private readonly prismaService: PrismaService) {}

  async createPrayer(createPrayerDto: CreatePrayerDto, user: any) {
    //get prfileId from request
    //from logged in user  userId get profileId
    // it means one profileId user provided me and one i quered by logged in user userId
    const profile = await this.prismaService.profile.findFirst({
      where: { userId: user.userId },
    });

    if (!profile) {
      throw new BadRequestException('Profile not found');
    }

    // check user providing profile id is same as we get profile id by logged in user userid
    const isUserProvidingProfileIdSameAsLoggedInUser =
      profile.id === createPrayerDto.profileId;
    // if not then throw error
    if (!isUserProvidingProfileIdSameAsLoggedInUser) {
      throw new BadRequestException(
        'Provided profile id is not same as logged in user profile id',
      );
    }

    // get user gender from profile
    const gender = profile.gender;
    // now get for which prayer user is trying to mark status
    //  for example if user is trying to mark status for fajr prayer
    // check is this time is valid for fajr prayer
    // get all prayers by user
    const loggedInUserPrayerTimings =
      await this.prismaService.prayerTimings.findFirst({
        where: {
          profileId: createPrayerDto.profileId,
        },
      });

    if (!loggedInUserPrayerTimings) {
      // get user location from user profile and fetch prayers and add them into db
      // for now thrwo an error
      throw new InternalServerErrorException('filed to find prayer timings');
    }

    // first get user is trying to mark status for which prayer
    // Check if the prayer start time has not arrived yet or if the prayer time has ended

    // then get start and end time for this prayer from db
    const startTime =
      loggedInUserPrayerTimings[
        createPrayerDto.prayerName.toLocaleLowerCase().concat('Start')
      ];
    const endTime =
      loggedInUserPrayerTimings[
        createPrayerDto.prayerName.toLocaleLowerCase().concat('End')
      ];

    const currentTime = new Date();
    const prayerTimeIsNotStartedYet = isBefore(currentTime, startTime);
    const prayerTimeHasEnded = isAfter(currentTime, endTime);
    const prayerTimeIsStartingNow = isEqual(currentTime, startTime);

    if (prayerTimeHasEnded) {
      throw new BadRequestException('you missed the prayer');
    } else if (prayerTimeIsNotStartedYet) {
      throw new BadRequestException('prayer time is not started yet ');
    }

    // now check is this user already marked status for this prayer
    // if yes then throw error
    // if time is valid and status is not marked then
    // get prayer status user is trying to mark
    // check user gender has this gender has valid to create  this prayer status
    // calculte time  is this time is valid for this status
    //if gender is men
    //  is MEN Prayerstatus = TAKBEERE_E_ULA
    //  is MEN Prayerstatus = SALATAL_JAMAAH
    //  is MEN Prayerstatus = INDIVIDUAL_PRAYER
    //  is MEN Prayerstatus = MISSED
    //  is MEN Prayerstatus = QAZA
    //if gender is women or other
    //  is WOMEN Prayerstatus = PRAYED_AT_TIME
    //  is WOMEN Prayerstatus = PRAYED_LATE
    //  is WOMEN Prayerstatus = PRAYED_TOO_LATE
    //  is WOMEN Prayerstatus = MISSED
    //  is WOMEN Prayerstatus = QAZA
    // if all conditions are valid then create prayer status
  }
}
