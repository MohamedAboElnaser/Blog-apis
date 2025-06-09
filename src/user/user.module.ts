import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { OtpModule } from 'src/otp/otp.module';
import { JwtModule } from '@nestjs/jwt';
import { BlogModule } from 'src/blog/blog.module';
import { EmailModule } from 'src/email/email.module';
import { UploadModule } from 'src/upload/upload.module';
import { NestjsFormDataModule } from 'nestjs-form-data';

@Module({
  imports: [
    OtpModule,
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
    JwtModule,
    BlogModule,
    EmailModule,
    UploadModule.register(), //Default configuration that use cloudinary as provider
    NestjsFormDataModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
