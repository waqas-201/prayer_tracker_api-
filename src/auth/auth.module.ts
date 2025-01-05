import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prismaModule/prisma.service';
import { TokenProvider } from './providers/token.provider';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { RegisterUserProvider } from './providers/registerUser.provider';
import { VerifyEmailProvider } from './providers/verifyEmail.provider';
import { LoginUserProvider } from './providers/loginUser.provider';
import { ClientTypeMiddleware } from 'src/middlewares/client-type.middleware';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RedisModule } from '@nestjs-modules/ioredis';
import { RefreshTokenProvider } from './providers/refresh.token.provider';
import { TokenBlacklistProvider } from './providers/token.blacklisting.provider';
import { LogoutProvider } from './providers/logout.provider';
import { ForgotPasswordProvider } from './providers/forrgotPassword.provider';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    ConfigService,
    TokenProvider,
    RegisterUserProvider,
    VerifyEmailProvider,
    LoginUserProvider,
    RefreshTokenProvider,
    TokenBlacklistProvider,
    JwtStrategy,
    JwtService,
    LogoutProvider,
    ForgotPasswordProvider,
  ],
  imports: [
    forwardRef(() => NotificationsModule),
    PassportModule,
    RedisModule.forRoot({
      type: 'single',
      url: 'redis://localhost:6379',
    }),
  ],
  exports: [TokenProvider],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ClientTypeMiddleware)
      .forRoutes('auth/login', 'auth/refresh');
  }
}
