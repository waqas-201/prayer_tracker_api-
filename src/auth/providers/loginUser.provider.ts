import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { LoginUserDto } from '../dto/loginUser';
import { PrismaService } from 'src/prismaModule/prisma.service';
import * as argon2 from 'argon2';
import { TokenProvider } from './token.provider';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class LoginUserProvider {
  constructor(
    private readonly prismaSrvice: PrismaService,
    private readonly tokenProvider: TokenProvider,
    private readonly configService: ConfigService,
  ) {}
  async loginUser(
    loginUserDto: LoginUserDto,
    client_type: string,
    res: Response,
  ) {
    //inpts are validated and sanitized by loginUserDto

    try {
      //check user existance
      const user = await this.prismaSrvice.user.findFirst({
        where: { email: loginUserDto.email },
      });

      if (!user) {
        throw new InternalServerErrorException('User does not exist');
      }


      const isEmailVerified = await this.prismaSrvice.user.findUnique({
        where: {
          id: user.id,
          emailVerified: true,
        },
      });
      if (!isEmailVerified) {
        throw new InternalServerErrorException('Email not verified');
      }
      //if user exits, grab user password and compare with password
      const isPasswordCorrect = await argon2.verify(
        user.password,
        loginUserDto.password,
      );
      if (!isPasswordCorrect) {
        throw new InternalServerErrorException('Invalid credentials');
      }
      //if password is correct generate access and refresh tokens and return those tokens in responce

      const [accessToken, refreshToken] =
        await this.tokenProvider.generateTokens(user);

      if (client_type === 'web') {
        res.cookie('access_token', accessToken, {
          httpOnly: true, //it will be accessible only by the web server not by javascript on client side via document.cookie
          secure: this.configService.get<string>('NODE_ENV') === 'production', //if NODE_ENV is production then cookie will be secured
          domain:
            this.configService.get<string>('NODE_ENV') === 'production'
              ? this.configService.get<string>('DOMAIN_PRODUCTION')
              : 'localhost',
          sameSite: 'strict',
          maxAge: 3600 * 24 * 7,
        });
        res.cookie('refresh_token', refreshToken, {
          httpOnly: true,
          secure: this.configService.get<string>('NODE_ENV') === 'production', //if NODE_ENV is production then cookie will be secured
          domain:
            this.configService.get<string>('NODE_ENV') === 'production'
              ? this.configService.get<string>('DOMAIN_PRODUCTION')
              : 'localhost',
          sameSite: 'strict',
          maxAge: 3600 * 24 * 7,
        });
        res.json({
          message: 'Login successful',
        });
      }

      if (client_type === 'mobile') {
        res.json({
          accessToken,
          refreshToken,
        });
      }

      //else return error
    } catch (error) {
      throw error;
    }
  }
}
