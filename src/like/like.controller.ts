import {
  Controller,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  Request,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { LikeService } from './like.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { RequestWithUser } from 'src/auth/types/request.type';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Likes')
@Controller('blogs')
export class LikeController {
  constructor(private likeService: LikeService) {}

  @Post(':id/like')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Like a blog post',
    description:
      'Like a public blog post. Users cannot like their own posts or private posts.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the blog to like',
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Blog liked successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Blog liked successfully' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request - Already liked or trying to like own blog',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Authentication required',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden - Cannot like a private blog',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found - Blog does not exist',
  })
  async likeBlog(
    @Param('id', ParseIntPipe) blogId: number,
    @Request() req: RequestWithUser,
  ) {
    return await this.likeService.likeBlog(req.user.sub, blogId);
  }

  @Post(':id/unlike')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Unlike a blog post',
    description: 'Remove like from a previously liked blog post.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the blog to unlike',
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Blog unliked successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Blog unliked successfully' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Authentication required',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found - You have not liked this blog',
  })
  async unLikeBlog(
    @Param('id', ParseIntPipe) blogId: number,
    @Request() req: RequestWithUser,
  ) {
    return await this.likeService.unlikeBlog(req.user.sub, blogId);
  }
}
