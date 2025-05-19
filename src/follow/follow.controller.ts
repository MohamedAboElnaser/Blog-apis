import {
  Controller,
  Param,
  ParseIntPipe,
  Post,
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
}
