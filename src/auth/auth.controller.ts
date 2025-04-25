import { Controller, Post, Param, Body } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Post('/register')
  register(@Param() param) {
    console.log('Param obj is', param);
    return {
      message: 'user register successfully',
    };
  }
  @Post('/verify-email')
  verify(@Body() body) {
    console.log('Body obj,', body);
    return 'Email verified';
  }

  @Post('/login')
  login() {
    return 'login successfully';
  }
}
