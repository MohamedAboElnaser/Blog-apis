import {
  Controller,
  DefaultValuePipe,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { FollowService } from './follow.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { RequestWithUser } from 'src/auth/types/request.type';

@Controller('users')
export class FollowController {
  constructor(private followService: FollowService) {}

  @Post(':id/follow')
  @UseGuards(AuthGuard)
  async follow(
    @Param('id', ParseIntPipe) followingId: number,
    @Request() req: RequestWithUser,
  ) {
    const userName = await this.followService.follow(req.user.sub, followingId);
    return {
      message: `You are now following ${userName}`,
    };
  }

  @Post(':id/unfollow')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async unfollow(
    @Param('id', ParseIntPipe) followingId: number,
    @Request() req: RequestWithUser,
  ) {
    await this.followService.unfollow(req.user.sub, followingId);
    return {
      message: 'Unfollowed user successfully',
    };
  }

  @Get(':id/followers')
  async getFollowers(
    @Param('id', ParseIntPipe) userId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ) {
    return await this.followService.getFollowers(userId, page, limit);
  }
}
