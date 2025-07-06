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
import { SeederModule } from './database/seeders/seeder.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        // If generating docs, use in-memory database
        if (process.env.NODE_ENV === 'docs') {
          return {
            type: 'sqlite',
            database: ':memory:',
            entities: [], // Empty entities to avoid loading issues
            synchronize: false,
            logging: false,
          };
        }
        // Normal database configuration
        return {
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
        };
      },
      inject: [ConfigService],
    }),
    BlogModule,
    CommentModule,
    EmailModule,
    FollowModule,
    LikeModule,
    SeederModule,
  ],
})
export class AppModule {}
