import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { JwtModule } from '@nestjs/jwt';
import { Blog } from 'src/blog/entities/blog.entity';
import { NestjsFormDataModule } from 'nestjs-form-data';

@Module({
  controllers: [CommentController],
  providers: [CommentService],
  imports: [
    TypeOrmModule.forFeature([Comment, Blog]),
    JwtModule,
    NestjsFormDataModule,
  ],
})
export class CommentModule {}
