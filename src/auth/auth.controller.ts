import {
  Controller,
  Post,
  Body,
  Version,
  Req,
  Get,
  Query,
  Headers,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register.dto';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { VerifyEmailDto } from './dto/verifyEmail.dto';
import { LoginUserDto } from './dto/loginUser';
import { IsPublic } from './decorators/isPublic';
import { short } from './constents/throttle_config';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { CurrentUser } from '../decorators/currentUser';

@Throttle({ ...short })
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @IsPublic()
  @Version('1')
  @Post('/register')
  async registerUser(
    @Body() registerUserDto: RegisterUserDto,
    @Req() req: Request,
  ) {
    return await this.authService.registerUser(registerUserDto, req);
  }

  @IsPublic()
  @Version('1')
  @Get('/verify-email')
  async verifyEmail(@Query() query: VerifyEmailDto) {
    return await this.authService.verifyEmail(query.token);
  }

  @IsPublic()
  @Version('1')
  @Post('/login')
  async loginUser(
    @Body() loginUserDto: LoginUserDto,
    @Headers('x-client-type') client_type: string,
    @Res() res: Response,
  ) {
    return await this.authService.loginUser(loginUserDto, client_type, res);
  }

  @IsPublic()
  @Version('1')
  @Post('/refresh')
  async refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Headers('x-client-type') client_type: string,
    @Res() res: Response,
  ) {
    return await this.authService.refresh(refreshTokenDto, client_type, res);
  }

  @Version('1')
  @Get('/logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    return await this.authService.logout(req, res);
  }

  @IsPublic()
  @Version('1')
  @Post('/forget-password')
  async forgetPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
    @Req() req: Request,
  ) {
    return await this.authService.forgotPassword(forgotPasswordDto, req);
  }

  @IsPublic()
  @Version('1')
  @Get('/forget-password')
  async forgetPasswordVerify(@Query() query: VerifyEmailDto) {
    return await this.authService.forgetPasswordVerify(query);
  }

  @IsPublic()
  @Version('1')
  @Post('/reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.authService.resetPassword(resetPasswordDto);
  }
  @Version('1')
  @Get('/me')
  async me(@Req() req: Request, @CurrentUser() user: any) {
    console.log(user, 'user in me auth contorle ');
  }
}
