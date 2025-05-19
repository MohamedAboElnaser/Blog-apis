import { Module } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowController } from './follow.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Follow } from './entities/follow.entity';
import { JwtModule } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Follow, User]), JwtModule],
  providers: [FollowService],
  controllers: [FollowController],
})
export class FollowModule {}
