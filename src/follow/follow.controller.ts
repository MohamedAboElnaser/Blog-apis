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
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FollowingsResponseDto } from './dto/followings-response.dto';
import { FollowersResponseDto } from './dto/followers-response.dto';

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
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Unfollow a user',
    description: 'Unfollow a user by their ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the user to unfollow',
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully unfollowed the user',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not following the specified user',
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
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
  @ApiOperation({
    summary: 'Get user followers',
    description: 'Get the followers of a user with pagination',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the user whose followers to retrieve',
    type: Number,
  })
  @ApiQuery({
    name: 'page',
    description: 'Page number for pagination',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Number of results per page',
    type: Number,
    required: false,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of followers returned successfully',
    type: FollowersResponseDto,
  })
  async getFollowers(
    @Param('id', ParseIntPipe) userId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ) {
    return await this.followService.getFollowers(userId, page, limit);
  }

  @Get(':id/followings')
  @ApiOperation({
    summary: 'Get user followings',
    description:
      'Get the users that a specific user is following with pagination',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the user whose followings to retrieve',
    type: Number,
  })
  @ApiQuery({
    name: 'page',
    description: 'Page number for pagination',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Number of results per page',
    type: Number,
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'List of followings returned successfully',
    type: FollowingsResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getFollowings(
    @Param('id', ParseIntPipe) userId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ) {
    return await this.followService.getFollowings(userId, page, limit);
  }
}
