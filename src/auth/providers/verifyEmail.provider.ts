import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prismaModule/prisma.service';
import { TokenProvider } from './token.provider';

@Injectable()
export class VerifyEmailProvider {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly tokenProvider: TokenProvider,
  ) {}
  async verifyEmail(token: string) {
    // verify and decode token
    const decodedToken = await this.tokenProvider.verifyToken(
      token,
      this.configService.get<string>('EMAIL_VERIFICATION_TOKEN_SECRET'),
    );

    //query user by user id in token
    //Check if Email is Already Verified
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          id: decodedToken.id,
          emailVerified: false,
        },
      });
      //if user is not in database then throw error
      if (!user) {
        throw new InternalServerErrorException('failed to verify email');
      }

      //if user is in database then update user record to email verified
      const updatedUser = await this.prismaService.user.update({
        where: {
          id: decodedToken.id,
        },
        data: {
          emailVerified: true,
        },
      });

      if (!updatedUser) {
        throw new InternalServerErrorException('failed to update user record');
      }
      // invalidate token so it can not be reused TODO :later

      return {
        message: 'email verified successfully',
      };
    } catch (error) {
      

      throw error;
    }
  }
}
