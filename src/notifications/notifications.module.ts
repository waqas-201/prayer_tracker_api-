import { forwardRef, Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { ResendModule } from 'nestjs-resend';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { NotificationProvider } from './providers/nofitication.provider';
import { SendVerificationEmailProvider } from './providers/SendVerificationEmailProvider';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    JwtService,
    NotificationProvider,
    SendVerificationEmailProvider,
  ],
  imports: [
    ResendModule.forRootAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        apiKey: configService.get<string>('RESEND_API_KEY'),
      }),
    }),

    forwardRef(() => AuthModule), // <-- Import AuthModule here
  ],
  exports: [SendVerificationEmailProvider],
})
export class NotificationsModule {}
