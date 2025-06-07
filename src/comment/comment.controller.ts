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
  Query,
  DefaultValuePipe,
  ParseIntPipe,
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
import { CommentWithAuthorDtoRes } from './dto/comment-with.author.dto';
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
  @ApiOperation({
    summary: 'Get all comments for a blog',
    description: 'Retrieve all comments for a specific public blog',
  })
  @ApiParam({
    name: 'blogId',
    type: 'number',
    description: 'ID of the blog to get comments from',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Comments retrieved successfully',
    type: CommentWithAuthorDtoRes,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found - Blog does not exist',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden - Blog is private',
  })
  findAll(
    @Param('blogId') blogId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.commentService.findAll(blogId, page, limit);
  }

  @Patch(':id')
  @FormDataRequest()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({
    summary: 'Update a comment',
    description:
      'Update an existing comment on a blog. Only the comment author can modify their own comments.',
  })
  @ApiBearerAuth('JWT-auth')
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiParam({
    name: 'blogId',
    type: 'number',
    description: 'ID of the blog containing the comment',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID of the comment to update',
  })
  @ApiBody({ type: UpdateCommentDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Comment successfully updated',
    type: CommentResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - User not authenticated',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description:
      'Forbidden - User is not the author of the comment or blog is private',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found - Comment or blog does not exist',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request - Invalid input data',
  })
  async update(
    @Param('blogId') blogId: number,
    @Param('id') id: number,
    @Body() updateCommentDto: UpdateCommentDto,
    @Request() req: RequestWithUser,
  ) {
    return await this.commentService.update(+id, {
      blogId,
      authorId: req.user.sub,
      updateCommentDto,
    });
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Delete a comment',
    description:
      'Delete an existing comment from a blog. Only the comment author can delete their own comments.',
  })
  @ApiBearerAuth('JWT-auth')
  @ApiParam({
    name: 'blogId',
    type: 'number',
    description: 'ID of the blog containing the comment',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Comment successfully deleted',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - User not authenticated',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden - User is not the author of the comment',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found - Comment or blog does not exist',
  })
  async remove(
    @Param('blogId') blogId: number,
    @Param('id') id: number,
    @Request() req: RequestWithUser,
  ) {
    return await this.commentService.remove(+id, {
      authorId: req.user.sub,
      blogId,
    });
  }
}
