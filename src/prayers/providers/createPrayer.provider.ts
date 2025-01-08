import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePrayerDto } from '../dto/create-prayer.dto';
import { PrismaService } from 'src/prismaModule/prisma.service';
import { MenPrayerStatus, WomenPrayerStatus } from '@prisma/client';

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
    const prayerType = createPrayerDto.PrayerType;
    //  for example if user is trying to mark status for fajr prayer
    // check is this time is valid for fajr prayer
    const prayerTimeByLoggedInUser =
      await this.prismaService.prayerTimings.findFirst({
        where: {
          profileId: createPrayerDto.profileId,
        },
      });

    if (!prayerTimeByLoggedInUser) {
      throw new BadRequestException(
        'Invalid prayer type or prayer time not found',
      );
    }

    // Filter out the specific prayer type

    console.log(prayerTimeByLoggedInUser);
    console.log(createPrayerDto.PrayerType.toLocaleLowerCase());
    const isPrayerTypeAvailable =
      prayerTimeByLoggedInUser[createPrayerDto.PrayerType.toLocaleLowerCase()];
    return { isPrayerTypeAvailable };

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
  }
}
