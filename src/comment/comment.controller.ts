import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ValidationPipe,
  UsePipes,
  Get,
  HttpStatus,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RequestWithUser } from 'src/auth/types/request.type';
import { FormDataRequest } from 'nestjs-form-data';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CommentResponseDto } from './dto/comment-response-dto';
@ApiTags('Comments')
@Controller('blogs/:blogId/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @FormDataRequest({})
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiOperation({ summary: 'Add comment to a public Blog' })
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiParam({
    name: 'blogId',
    type: 'number',
    description: 'ID of the blog to comment on',
  })
  @ApiBody({ type: CreateCommentDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Comment created successfully',
    type: CommentResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - User not authenticated',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden - Blog is not public',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found - Blog does not exist',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request - Invalid input data',
  })
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @Param('blogId') blogId: number,
    @Request() req: RequestWithUser,
  ) {
    return await this.commentService.create({
      body: createCommentDto.body,
      blogId,
      authorId: req.user.sub,
    });
  }

  @Get()
  findAll(@Param('blogId') blogId: number) {
    return this.commentService.findAll(blogId);
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
  @UseGuards(AuthGuard)
  remove(
    @Param('blogId') blogId: number,
    @Param('id') id: number,
    @Request() req: RequestWithUser,
  ) {
    return this.commentService.remove(+id, { authorId: req.user.sub, blogId });
  }
}
