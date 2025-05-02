import { Injectable } from '@nestjs/common';
import { LoginDTO } from './dto/login-dto';

@Injectable()
export class AuthService {
  verify(email: string) {
    return {
      message: 'User email verified successfully',
    };
  }

  login(data: LoginDTO) {
    return {
      message: 'login successfully',
    };
  }
}
