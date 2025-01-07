import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ResetPasswordDto } from '../dto/resetPassword.dto';
import { PrismaService } from 'src/prismaModule/prisma.service';
import * as argon2 from 'argon2';
import { TokenProvider } from './token.provider';
import { ConfigService } from '@nestjs/config';
import { TokenBlacklistProvider } from './token.blacklisting.provider';

@Injectable()
export class ResetPasswordProvider {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly tokenProvider: TokenProvider,
    private readonly configService: ConfigService,
    private readonly tokenBlacklistProvider: TokenBlacklistProvider,
  ) {}

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<any> {
    try {
      // Verify token
      const payload = await this.tokenProvider.verifyToken(
        resetPasswordDto.token,
        this.configService.get<string>('PASSWORD_RESET_TOKEN_SECRET'),
      );
      if (!payload) {
        throw new UnauthorizedException('Invalid token');
      }

      // Check if token is blacklisted
      const isTokenBlacklisted =
        await this.tokenBlacklistProvider.isTokenBlacklisted(
          payload.id,
          resetPasswordDto.token,
        );
      if (isTokenBlacklisted) {
        throw new ForbiddenException('Token has been blacklisted');
      }

      // Check if user is allowed to reset password
      const user = await this.prismaService.user.findUnique({
        where: { id: payload.id },
      });

      if (!user || !user.canResetPassword) {
        throw new ForbiddenException(
          'Password reset is not allowed for this user',
        );
      }

      // Hash the new password
      const hashedPassword = await argon2.hash(resetPasswordDto.password);

      // Update user password and reset flag
      await this.prismaService.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          canResetPassword: false,
        },
      });

      // Blacklist the token
      await this.tokenBlacklistProvider.blacklistToken(
        user.id,
        resetPasswordDto.token,
        new Date(),
      );

      return { message: 'Password reset successfully' };
    } catch (error) {
      // Log the error (omitted for brevity)
      throw error;
    }
  }
}
