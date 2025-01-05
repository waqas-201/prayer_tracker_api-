import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt_access') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: (req: Request) => {
        // First, try to get the token from the cookies
        const tokenFromCookie = req.cookies['access_token'];

        if (tokenFromCookie) {
          return tokenFromCookie;
        }

        // If no token in cookies, try to extract from the Authorization header
        return ExtractJwt.fromAuthHeaderAsBearerToken()(req);
      },
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET'),
    });
  }

  async validate(payload: any) {
    console.log(payload);
    
    return { userId: payload.sub, username: payload.username };
  }
}
