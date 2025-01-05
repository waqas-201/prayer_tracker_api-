import { BadRequestException, Injectable } from '@nestjs/common';
import { ForgotPasswordDto } from '../dto/forgotPassword.dto';
import { PrismaService } from 'src/prismaModule/prisma.service';
import { ConfigService } from '@nestjs/config';
import { SendVerificationEmailProvider } from 'src/notifications/providers/SendVerificationEmailProvider';

@Injectable()
export class ForgotPasswordProvider {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly sendVerificationEmailProvider: SendVerificationEmailProvider,
  ) {}
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
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

      //return success
    } catch (error) {}
  }
}
