import {
  Controller,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { LikeService } from './like.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { RequestWithUser } from 'src/auth/types/request.type';

@Controller('blogs')
export class LikeController {
  constructor(private likeService: LikeService) {}

  @Post(':id/like')
  @UseGuards(AuthGuard)
  async likeBlog(
    @Param('id', ParseIntPipe) blogId: number,
    @Request() req: RequestWithUser,
  ) {
    return await this.likeService.likeBlog(req.user.sub, blogId);
  }
}
