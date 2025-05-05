import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { UserModule } from 'src/user/user.module';
import { HashingService } from './hashing.service';

@Module({
  imports: [NestjsFormDataModule, forwardRef(() => UserModule)],
  controllers: [AuthController],
  providers: [AuthService, HashingService],
  exports: [HashingService],
})
export class AuthModule {}
