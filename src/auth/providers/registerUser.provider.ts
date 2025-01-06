import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prismaModule/prisma.service';
import * as argon2 from 'argon2';
import { ConfigService } from '@nestjs/config';
import { SendVerificationEmailProvider } from 'src/notifications/providers/SendVerificationEmailProvider';
import { RegisterUserDto } from '../dto/register.dto';
import { Request } from 'express';

@Injectable()
export class RegisterUserProvider {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly sendVerificationEmailProvider: SendVerificationEmailProvider,
  ) {}

  async registerUser(registerUserDto: RegisterUserDto, req: Request) {
    // data is validate and sanitized by the registerUserDto

    try {
      // check if user already exists
      const user = await this.prismaService.user.findFirst({
        where: {
          email: registerUserDto.email,
        },
      });

      if (user) {
        throw new BadRequestException('user already eists ');
      }
      //if use not exists lets hash user password
      const hashedPassword = await argon2.hash(registerUserDto.password);

      // time to create user
      const savedUser = await this.prismaService.user.create({
        data: {
          email: registerUserDto.email,
          password: hashedPassword,
        },
      });

      if (!savedUser) {
        throw new InternalServerErrorException(
          'some thing went wrong while registring user',
        );
      }

      // if user is created successfully then  send email to user for email varification
      // send user verification email

    const result =
      await this.sendVerificationEmailProvider.sendUserVerificationEmail(
        savedUser.id,
        req,
        'v1/auth/verify-email',
        this.configService.get<string>('EMAIL_VERIFICATION_TOKEN_SECRET'),
      );
    console.log(result);
        
      return {
        message: 'user created successfully',
      };
    } catch (error) {
      throw error;
    }
  }
}
