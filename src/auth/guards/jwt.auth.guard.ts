import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt } from 'passport-jwt';
import { Observable } from 'rxjs';
import { TokenBlacklistProvider } from '../providers/token.blacklisting.provider';
import { TokenProvider } from '../providers/token.provider';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs'; // Import to convert Observable to Promise

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt_access') {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtservice: JwtService,
    private readonly tokenBlacklistProvider: TokenBlacklistProvider,
    private readonly tokenProvider: TokenProvider,
    private readonly configService: ConfigService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Ensure the return type is a Promise<boolean>
    const request: Request = context.switchToHttp().getRequest();

    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // Extract token from request
    const token =
      request.cookies['access_token'] ||
      ExtractJwt.fromAuthHeaderAsBearerToken()(request);

    // Verify the token using your TokenProvider
    const payload = await this.tokenProvider.verifyToken(
      token,
      this.configService.get<string>('JWT_ACCESS_SECRET'),
    );

    // Check if the token is blacklisted
    const isBlacklisted = await this.tokenBlacklistProvider.isTokenBlacklisted(
      payload.id, // Use payload id for blacklist check
      token,
    );

    // If token is blacklisted, deny access
    if (isBlacklisted) {
      return false;
    }

    // Proceed with the default AuthGuard logic
    // If the base AuthGuard is asynchronous, resolve it with `firstValueFrom`
    const result = await super.canActivate(context);
    return result instanceof Observable ? await firstValueFrom(result) : result;
  }
}
