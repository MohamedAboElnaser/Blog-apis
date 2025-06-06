import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseSeeder } from './database.seeder';
import { User } from '../../user/entities/user.entity';
import { Blog } from '../../blog/entities/blog.entity';
import { Comment } from '../../comment/entities/comment.entity';
import { Like } from '../../like/entities/like.entity';
import { Follow } from '../../follow/entities/follow.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Blog, Comment, Like, Follow])],
  providers: [DatabaseSeeder],
  exports: [DatabaseSeeder],
})
export class SeederModule {}
