import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

@Injectable()
export class TokenProvider {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signToken(payload: Object, secret: string, expiresIn: string) {
    try {
      const token = await this.jwtService.signAsync(
        {
          ...payload,
        },
        {
          expiresIn: expiresIn,
          secret: secret,
        },
      );

      if (!token) {
        throw new InternalServerErrorException(
          'failed to generate access token',
        );
      }

      return token;
    } catch (error) {
      throw error;
    }
  }

  async generateTokens(user: User) {
    return await Promise.all([
      await this.signToken(
        {
          id: user.id,
          email: user.email,
          googleId: user.googleId,
        },
        this.configService.get<string>('JWT_ACCESS_SECRET'),
        '1h',
      ),
      await this.signToken(
        {
          id: user.id,
          googleId: user.googleId,
        },
        this.configService.get<string>('JWT_REFRESH_SECRET'),
        '10d',
      ),
    ]);
  }

  async verifyToken(token: string, secret: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: secret,
      });

      if (!payload) {
        throw new InternalServerErrorException('Verification failed');
      }
      return payload;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
