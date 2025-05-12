import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UsePipes,
  Get,
  UseGuards,
  Request,
  HttpCode,
} from '@nestjs/common';
import { RegisterDTO } from './dto/register-dto';
import { VerifyEmailDTO } from './dto/verify-email-dto';
import { LoginDTO } from './dto/login-dto';
import { FormDataRequest } from 'nestjs-form-data';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { AuthGuard } from './auth.guard';
import { ResendCodeDto } from './dto/resend-otp';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}
  @Post('/register')
  @FormDataRequest()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async register(
    @Body()
    body: RegisterDTO,
  ) {
    const user = await this.userService.add(body);
    return {
      message: `User registered successfully , Check ${user.email} for Verification code`,
      user,
    };
  }
  @Post('/verify-email')
  @FormDataRequest()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async verify(@Body() body: VerifyEmailDTO) {
    await this.authService.verify(body);
    return {
      message: `Email Verified successfully , Now you can Login`,
    };
  }

  @Post('/login')
  @FormDataRequest()
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async login(
    @Body()
    body: LoginDTO,
  ) {
    const token = await this.authService.login(body);
    return {
      message: `Login successfully`,
      token,
    };
  }

  @Post('/resend-verification-code')
  @FormDataRequest()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async resendVerificationCode(@Body() body: ResendCodeDto) {
    return await this.authService.resendVerificationCode(body);
  }
}
