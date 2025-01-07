import { BadRequestException, Injectable } from '@nestjs/common';
import { ForgetPasswordVerifyDto } from '../dto/ForgetPasswordVerify.Dto';
import { TokenProvider } from './token.provider';
import { TokenBlacklistProvider } from './token.blacklisting.provider';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prismaModule/prisma.service';

@Injectable()
export class forgetPasswordVerifyProvider {
  constructor(
    private readonly tokenProvider: TokenProvider,
    private readonly tokenBlacklistProvider: TokenBlacklistProvider,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {}

  async forgetPasswordVerify(forgetPasswordVerifyDto: ForgetPasswordVerifyDto) {
    try {
      // validate token
      const payload = await this.tokenProvider.verifyToken(
        forgetPasswordVerifyDto.token,
        this.configService.get<string>('PASSWORD_RESET_TOKEN_SECRET'),
      );

      // the purpose of blacklsting this token to make link one time use so user can reset password with
      //one token only once
      //get token check is token not blacklisted

      const isBlacklisted =
        await this.tokenBlacklistProvider.isTokenBlacklisted(
          payload.userId,
          forgetPasswordVerifyDto.token,
        );

      if (isBlacklisted) {
        throw new BadRequestException('this link is only for one time use');
      }
      // update flag to canResetPassword to true so user can reset password
      await this.prismaService.user.update({
        where: {
          id: payload.id,
        },
        data: { canResetPassword: true },
      });

      return {
        message: 'reset password token verified',
      };
      // if token is valid set canverify true
    } catch (error) {
      throw error;
    }
  }
}
