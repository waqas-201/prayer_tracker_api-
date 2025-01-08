import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
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
import { forgetPasswordVerifyProvider } from './providers/forgetPasswordVerify.provider';
import { ResetPasswordProvider } from './providers/resetPassword.provider';
import { CurrentUser } from '../decorators/currentUser';

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
    forgetPasswordVerifyProvider,
    ResetPasswordProvider,
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
    consumer.apply(ClientTypeMiddleware).forRoutes(
      {
        path: '*auth/login',
        method: RequestMethod.POST, // Optional: Only for POST requests
      },
      {
        path: '*auth/refresh',
        method: RequestMethod.POST, // Optional: Only for POST requests
      },
    );
  }
}
