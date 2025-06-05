import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { UserModule } from 'src/user/user.module';
import { HashingService } from './hashing.service';
import { OtpModule } from 'src/otp/otp.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailModule } from 'src/email/email.module';
import { AuthGuard } from './auth.guard';
import { OptionalAuthGuard } from './optional-auth.guard';

@Module({
  imports: [
    NestjsFormDataModule,
    forwardRef(() => UserModule),
    OtpModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') },
      }),
    }),
    EmailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, HashingService, AuthGuard, OptionalAuthGuard],
  exports: [HashingService, AuthGuard],
})
export class AuthModule {}
