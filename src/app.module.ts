import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrayersModule } from './prayers/prayers.module';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { PrismaModule } from './prismaModule/prisma.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ConfigModule } from '@nestjs/config';
import { HstsMiddleware } from './middlewares/hsts.middleware';
import { JwtAuthGuard } from './auth/guards/jwt.auth.guard';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TokenBlacklistProvider } from './auth/providers/token.blacklisting.provider';
import { ProfileModule } from './profile/profile.module';
import { PrayertimingsModule } from './prayertimings/prayertimings.module';

@Module({
  imports: [
    PrayersModule,
    PrismaModule,
    JwtModule,
    ThrottlerModule.forRoot([
      {
        ttl: 1000, // 1 second
        limit: 10, // 10 requests per second
      },
    ]),
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.development.local', '.env.development'],
    }),
    AuthModule,
    NotificationsModule,
    ProfileModule,
    PrayertimingsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    JwtService,
    TokenBlacklistProvider,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HstsMiddleware).forRoutes('*');
  }
}
