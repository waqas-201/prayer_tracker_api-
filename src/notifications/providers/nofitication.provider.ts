import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ResendService } from 'nestjs-resend';

@Injectable()
export class NotificationProvider {
  constructor(private resendService: ResendService) {}

  async sendEmail(userEmail: string, text: string, subject: string) {
    try {
      return await this.resendService.send({
        from: 'Acme <onboarding@resend.dev>',
        to: 'waqasvu892@gmail.com', // this is registered email on resend after adding domain we will use "userEmail" here
        subject: subject,
        text: text,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to send email',
        error.message,
      );
    }
  }
}
