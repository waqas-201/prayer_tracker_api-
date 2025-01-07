import { RefreshTokenDto } from '../dto/refreshToken.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { TokenProvider } from './token.provider';
import { ConfigService } from '@nestjs/config';
import { TokenBlacklistProvider } from './token.blacklisting.provider';
import { PrismaService } from 'src/prismaModule/prisma.service';
import { Request, Response } from 'express';

@Injectable()
export class RefreshTokenProvider {
  constructor(
    private readonly tokenProvider: TokenProvider,
    private readonly configService: ConfigService,
    private readonly tokenBlacklistProvider: TokenBlacklistProvider,
    private readonly prismaService: PrismaService,
  ) {}
  async refresh(
    refreshTokenDto: RefreshTokenDto,
    client_type: string,
    res: Response,
  ) {
    try {
      //  Implement refresh token logic
      //1 - Check if the refresh token is valid
      const payload = await this.tokenProvider.verifyToken(
        refreshTokenDto.refreshToken,
        this.configService.get<string>('JWT_REFRESH_SECRET'),
      );

      //2 get user form db by id
      const user = await this.prismaService.user.findUnique({
        where: {
          id: payload.id,
        },
      });

      //3 - check is token blacklisted or not
      const isTokenBlacklisted =
        await this.tokenBlacklistProvider.isTokenBlacklisted(
          user.id,
          refreshTokenDto.refreshToken,
        );

      if (isTokenBlacklisted) {
        throw new BadRequestException('Token is blacklisted'); // TODO IN production change error message
      }

      //4  -above conditions are met, then generate new access token and return it
      const [accessToken, refreshToken] =
        await this.tokenProvider.generateTokens(user);

      // if we successfully generate new tokens, then blacklist the old one
      if (accessToken && refreshToken) {
        await this.tokenBlacklistProvider.blacklistToken(
          user.id,
          refreshTokenDto.refreshToken,
          payload.exp,
        );
      }

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

      return { accessToken, refreshToken };
      // 4 and add this refresh token to blackilist
    } catch (error) {
      throw error;
    }
  }
}
