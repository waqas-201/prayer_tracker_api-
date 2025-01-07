import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { NotificationProvider } from './nofitication.provider';
import { TokenProvider } from 'src/auth/providers/token.provider';
import { PrismaService } from 'src/prismaModule/prisma.service';

@Injectable()
export class SendVerificationEmailProvider {
  constructor(
    private readonly notificationProvider: NotificationProvider,
    private readonly tokenprovider: TokenProvider,
    private readonly prismaService: PrismaService,
  ) {}

  async sendUserVerificationEmail(
    userId: string,
    req: Request,
    endPoint: string,
    tokenSecret: string,
  ) {
    try {
      //generate jwt token
      const verificationToken = await this.tokenprovider.signToken(
        { id: userId },
        tokenSecret,
        '1h',
      );

      // find user email
      const userEmail = await this.prismaService.user.findUnique({
        where: {
          id: userId,
        },
      });

      // Dynamically generate the base URL from the request object
      const protocol = req.protocol; // 'http' or 'https'
      const host = req.get('host');
      const verificationLink = `${protocol}://${host}/${endPoint}?token=${verificationToken}`;

      const text = `
          <h1>Welcome to the Prayer Tracker</h1>
          <p>Please use the following link to verify your email</p>
          <a href="${verificationLink}">${verificationLink}</a>
          `;
      const subject = 'Verify your email';

      return await this.notificationProvider.sendEmail(
        userEmail.email,
        text,
        subject,
      );
    } catch (error) {
      throw error;
    }
  }
}
