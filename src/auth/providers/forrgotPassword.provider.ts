import { BadRequestException, Injectable } from '@nestjs/common';
import { ForgotPasswordDto } from '../dto/forgotPassword.dto';
import { PrismaService } from 'src/prismaModule/prisma.service';
import { ConfigService } from '@nestjs/config';
import { SendVerificationEmailProvider } from 'src/notifications/providers/SendVerificationEmailProvider';
import { Request } from 'express';

@Injectable()
export class ForgotPasswordProvider {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly sendVerificationEmailProvider: SendVerificationEmailProvider,
  ) {}

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto, req: Request) {
    try {
      //check if email exists
      const user = await this.prismaService.user.findFirst({
        where: {
          email: forgotPasswordDto.email,
        },
      });
      if (!user) {
        throw new BadRequestException('Email not found');
      }

      //send email
      await this.sendVerificationEmailProvider.sendUserVerificationEmail(
        user.id,
        req,
        'api/v1/auth/forget-password',
        this.configService.get<string>('PASSWORD_RESET_TOKEN_SECRET'),
      );

      //return success
    } catch (error) {}
  }
}
