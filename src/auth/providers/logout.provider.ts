import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ExtractJwt } from 'passport-jwt';
import { TokenBlacklistProvider } from './token.blacklisting.provider';
import { TokenProvider } from './token.provider';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LogoutProvider {
  constructor(
    private readonly tokenblocklistProvider: TokenBlacklistProvider,
    private readonly tokenprovider: TokenProvider,
    private readonly configService: ConfigService,
  ) {}
  async logout(request: Request) {
    // Extract token from request
    const token =
      request.cookies['access_token'] ||
      ExtractJwt.fromAuthHeaderAsBearerToken()(request);

    const payload = await this.tokenprovider.verifyToken(
      token,
      this.configService.get<string>('JWT_ACCESS_SECRET'),
    );

    const blacklistToken = this.tokenblocklistProvider.blacklistToken(
      payload.id,
      token,
      payload.exp,
    );
  }
}
