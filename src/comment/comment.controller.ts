import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RequestWithUser } from 'src/auth/types/request.type';
import { FormDataRequest } from 'nestjs-form-data';

@Controller('blogs/:blogId/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @FormDataRequest({})
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  create(
    @Body() createCommentDto: CreateCommentDto,
    @Param('blogId') blogId: number,
    @Request() req: RequestWithUser,
  ) {
    return this.commentService.create({
      body: createCommentDto.body,
      blogId,
      authorId: req.user.sub,
    });
  }

  @Get()
  findAll() {
    return this.commentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(+id);
  }

  @Patch(':id')
  @FormDataRequest()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  update(
    @Param('blogId') blogId: number,
    @Param('id') id: number,
    @Body() updateCommentDto: UpdateCommentDto,
    @Request() req: RequestWithUser,
  ) {
    return this.commentService.update(+id, {
      blogId,
      authorId: req.user.sub,
      updateCommentDto,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentService.remove(+id);
  }
}
