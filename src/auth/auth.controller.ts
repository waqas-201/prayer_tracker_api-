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
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register.dto';
import { Throttle } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { VerifyEmailDto } from './dto/verifyEmail.dto';
import { LoginUserDto } from './dto/loginUser';
import { JwtAuthGuard } from './guards/jwt.auth.guard';
import { IsPublic } from './decorators/isPublic';
import { short } from './constents/throttle_config';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle({ ...short })
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

  @Throttle({ ...short })
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
  async logout(@Req() req: Request) {
    return await this.authService.logout(req);
  }

  @Version('1')
  @Get('/proctacted')
  async getPrctacted() {
    return 'pratcted';
  }

  @Version('1')
  @IsPublic()
  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return await this.authService.forgotPassword(forgotPasswordDto);
  }
}
