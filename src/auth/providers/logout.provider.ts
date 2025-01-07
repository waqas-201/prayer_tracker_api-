import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Request, Response } from 'express';
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

  async logout(request: Request, res: Response) {
    try {
      // Extract access token
      const accessToken =
        request.cookies['access_token'] ||
        ExtractJwt.fromAuthHeaderAsBearerToken()(request);

      // Extract refresh token
      const refreshToken =
        request.cookies['refresh_token'] || request.headers['x-refresh-token'];

      // Verify and blacklist the access token
      if (!accessToken) {
        throw new InternalServerErrorException('Access token not found');
      }

      // Strict validation for access token
      const accessTokenPayload = await this.tokenprovider.verifyToken(
        accessToken,
        this.configService.get<string>('JWT_ACCESS_SECRET'),
      );

      await this.tokenblocklistProvider.blacklistToken(
        accessTokenPayload.id,
        accessToken,
        accessTokenPayload.exp,
      );

      // Optional: Clear cookies for web clients
      if (res) {
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
      }

      // Handle refresh token validation and blacklist
      if (refreshToken) {
        try {
          const refreshTokenPayload = await this.tokenprovider.verifyToken(
            refreshToken,
            this.configService.get<string>('JWT_REFRESH_SECRET'),
          );
          await this.tokenblocklistProvider.blacklistToken(
            refreshTokenPayload.id,
            refreshToken,
            refreshTokenPayload.exp,
          );
        } catch (error) {
          console.warn('Refresh token invalid or expired. Proceeding...');
        }
      }

      // Respond with success
      res.json({ message: 'Logout successful' });
    } catch (error) {
      console.error('Logout failed:', error.message);
      throw error; // Return error response to the frontend
    }
  }
}
