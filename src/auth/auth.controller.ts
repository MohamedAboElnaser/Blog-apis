import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { RegisterDTO } from './dto/register-dto';
import { VerifyEmailDTO } from './dto/verify-email-dto';
import { LoginDTO } from './dto/login-dto';
import { FormDataRequest } from 'nestjs-form-data';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';

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
  verify(@Body(new ValidationPipe()) body: VerifyEmailDTO) {
    return this.authService.verify(body.email);
  }

  @Post('/login')
  @FormDataRequest()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  login(
    @Body()
    body: LoginDTO,
  ) {
    return this.authService.login(body);
  }
}
