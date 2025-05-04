import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { UserModule } from 'src/user/user.module';
import { PasswordService } from './password.service';

@Module({
  imports: [NestjsFormDataModule, forwardRef(() => UserModule)],
  controllers: [AuthController],
  providers: [AuthService, PasswordService],
  exports: [PasswordService],
})
export class AuthModule {}
