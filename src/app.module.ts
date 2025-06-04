import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { Otp } from './otp/entities/otp.entity';
import { BlogModule } from './blog/blog.module';
import { Blog } from './blog/entities/blog.entity';
import { CommentModule } from './comment/comment.module';
import { Comment } from './comment/entities/comment.entity';
import { EmailModule } from './email/email.module';
import { FollowModule } from './follow/follow.module';
import { Follow } from './follow/entities/follow.entity';
import { LikeModule } from './like/like.module';
import { Like } from './like/entities/like.entity';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [User, Otp, Blog, Comment, Follow, Like],
        synchronize: configService.get<boolean>('DB_SYNCHRONIZE', true), // Default to true for development
        logger: 'simple-console',
        logging: ['log', 'info', 'error'],
      }),
    }),
    BlogModule,
    CommentModule,
    EmailModule,
    FollowModule,
    LikeModule,
  ],
})
export class AppModule {}
