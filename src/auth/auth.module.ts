import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [NestjsFormDataModule, UserModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
