import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/register.dto';
import { RegisterUserProvider } from './providers/registerUser.provider';
import { Request, Response } from 'express';
import { VerifyEmailProvider } from './providers/verifyEmail.provider';
import { LoginUserDto } from './dto/loginUser';
import { LoginUserProvider } from './providers/loginUser.provider';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import { RefreshTokenProvider } from './providers/refresh.token.provider';
import { LogoutProvider } from './providers/logout.provider';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { ForgotPasswordProvider } from './providers/forrgotPassword.provider';
import { ForgetPasswordVerifyDto } from './dto/ForgetPasswordVerify.Dto';
import { forgetPasswordVerifyProvider } from './providers/forgetPasswordVerify.provider';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { ResetPasswordProvider } from './providers/resetPassword.provider';

@Injectable()
export class AuthService {
  constructor(
    private readonly registerUserProvider: RegisterUserProvider,
    private readonly verifyEmailProvider: VerifyEmailProvider,
    private readonly loginUserProvider: LoginUserProvider,
    private readonly refreshTokenProvider: RefreshTokenProvider,
    private readonly logoutProvider: LogoutProvider,
    private readonly forgotPasswordProvider: ForgotPasswordProvider,
    private readonly forgetPasswordVerifyProvider: forgetPasswordVerifyProvider,
    private readonly resetPasswordProvider: ResetPasswordProvider,
  ) {}

  async registerUser(registerUserDto: RegisterUserDto, req: Request) {
    return await this.registerUserProvider.registerUser(registerUserDto, req);
  }

  async verifyEmail(token: string) {
    return await this.verifyEmailProvider.verifyEmail(token);
  }

  async loginUser(
    loginUserDto: LoginUserDto,
    client_type: string,
    res: Response,
  ) {
    return await this.loginUserProvider.loginUser(
      loginUserDto,
      client_type,
      res,
    );
  }

  async refresh(
    refreshTokenDto: RefreshTokenDto,
    client_type: string,
    res: Response,
  ) {
    return await this.refreshTokenProvider.refresh(
      refreshTokenDto,
      client_type,
      res,
    );
  }

  async logout(req: Request, res: Response) {
    return await this.logoutProvider.logout(req, res);
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto, req: Request) {
    return await this.forgotPasswordProvider.forgotPassword(
      forgotPasswordDto,
      req,
    );
  }

  async forgetPasswordVerify(forgetPasswordVerifyDto: ForgetPasswordVerifyDto) {
    return await this.forgetPasswordVerifyProvider.forgetPasswordVerify(
      forgetPasswordVerifyDto,
    );
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    return await this.resetPasswordProvider.resetPassword(resetPasswordDto);
  }
}
