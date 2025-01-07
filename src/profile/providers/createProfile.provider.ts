import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from '../dto/create-profile.dto';

@Injectable()
export class CreateProfileProvider {
  constructor() {}

  async createProfile(createProfileDto: CreateProfileDto) {
    // first of all user must be authancated to create a profile

    // so if user is authancated we got user id in request object
    // check user is authorized to create profile
    // check that userid is same as user id in createProfileDto
    // if not same it means someone else is logged in and trying to create profile for someone else
    // so we can throw an error
    // if user id is same as user id in createProfileDto then we can create profile
    //if profile creation is successful  take location data from profile
    //  and query prayers timing by this location data
    // take those prayers timing and save in database
    // return created profile

    return createProfileDto;
  }
}
