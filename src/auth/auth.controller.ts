import { Controller, Post, Body } from '@nestjs/common';
import { ValidationPipe } from '../utils/validation-pipe';
import { RegisterDTO } from './dto/register-dto';
import { VerifyEmailDTO } from './dto/verify-email-dto';
import { LoginDTO } from './dto/login-dto';
import { FormDataRequest } from 'nestjs-form-data';

@Controller('auth')
export class AuthController {
  @Post('/register')
  @FormDataRequest()
  register(
    @Body(new ValidationPipe())
    body: RegisterDTO,
  ) {
    return {
      message: 'user register successfully',
      body,
    };
  }
  @Post('/verify-email')
  @FormDataRequest()
  verify(@Body(new ValidationPipe()) body: VerifyEmailDTO) {
    console.log('Body obj,', body);
    return {
      message: 'email verified',
      body,
    };
  }

  @Post('/login')
  @FormDataRequest()
  login(@Body(new ValidationPipe()) body: LoginDTO) {
    return {
      message: 'login successfully',
      body,
    };
  }
}
