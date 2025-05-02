import { Controller, Post, Body } from '@nestjs/common';
import { ValidationPipe } from '../utils/validation-pipe';
import { RegisterDTO } from './dto/register-dto';
import { VerifyEmailDTO } from './dto/verify-email-dto';
import { LoginDTO } from './dto/login-dto';
import { FormDataRequest } from 'nestjs-form-data';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}
  @Post('/register')
  @FormDataRequest()
  register(
    @Body(new ValidationPipe())
    body: RegisterDTO,
  ) {
    return this.userService.add({ ...body } as User);
  }
  @Post('/verify-email')
  @FormDataRequest()
  verify(@Body(new ValidationPipe()) body: VerifyEmailDTO) {
    console.log('Body obj,', body);
    return this.authService.verify(body.email);
  }

  @Post('/login')
  @FormDataRequest()
  login(@Body(new ValidationPipe()) body: LoginDTO) {
    return this.authService.login(body);
  }
}
