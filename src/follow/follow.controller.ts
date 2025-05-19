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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Users - Follow')
@Controller('users')
export class FollowController {
  constructor(private followService: FollowService) {}

  @Post(':id/follow')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Follow a user',
    description: 'Follow a user by their ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the user to follow',
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successfully followed the user',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request - Already following or trying to follow yourself',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
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

  @Get(':id/followings')
  async getFollowings(
    @Param('id', ParseIntPipe) userId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ) {
    return await this.followService.getFollowings(userId, page, limit);
  }
}
