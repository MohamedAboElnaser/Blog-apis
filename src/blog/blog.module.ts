import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';

@Module({
  imports: [
    NestjsFormDataModule,
    AuthModule,
    JwtModule,
    TypeOrmModule.forFeature([Blog]),
  ],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
