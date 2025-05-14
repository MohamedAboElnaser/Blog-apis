import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Request,
  ParseIntPipe,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { FormDataRequest } from 'nestjs-form-data';
import { AuthGuard } from 'src/auth/auth.guard';
import { RequestWithUser } from 'src/auth/types/request.type';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { Blog } from './entities/blog.entity';
import { BlogResponseDto } from './dto/create-blog-response.dto';
import { BlogsListResponseDto } from './dto/list-user-blogs.dto';

@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @FormDataRequest()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiOperation({ summary: 'Create a new blog post' })
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiBody({ type: CreateBlogDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The blog post has been successfully created',
    type: BlogResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request - Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Authentication required',
  })
  create(
    @Body() createBlogDto: CreateBlogDto,
    @Request() req: RequestWithUser,
  ) {
    return this.blogService.create({
      ...createBlogDto,
      authorId: req.user.sub,
    });
  }

  @Get() //TODO Add pagination feature to the endpoint
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Get all blogs for the current Logged in user (Public & Private)',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of blogs retrieved successfully',
    type: BlogsListResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Authentication required',
  })
  async findAll(@Request() req: RequestWithUser) {
    const blogs = await this.blogService.findAll(req.user.sub);
    return {
      count: blogs.length,
      blogs,
    };
  }

  @Get('/:id')
  findOne(
    @Param(
      'id',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
        exceptionFactory: () => {
          throw new BadRequestException('Id parameter must be a valid number');
        },
      }),
    )
    id: number,
  ) {
    return this.blogService.findOne(+id);
  }

  @Patch('/:id')
  @FormDataRequest()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  update(
    @Param(
      'id',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
        exceptionFactory: () => {
          throw new BadRequestException('Id parameter must be a valid number');
        },
      }),
    )
    id: number,
    @Body() updateBlogDto: UpdateBlogDto,
    @Request() req: RequestWithUser,
  ) {
    return this.blogService.update(+id, req.user.sub, updateBlogDto);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  async remove(
    @Param(
      'id',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
        exceptionFactory: () => {
          throw new BadRequestException('Id parameter must be a valid number');
        },
      }),
    )
    id: number,
    @Request() req: RequestWithUser,
  ) {
    await this.blogService.remove(+id, req.user.sub);
  }

  @Get('/private-blogs/:id')
  @UseGuards(AuthGuard)
  findPrivateOne(
    @Param(
      'id',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
        exceptionFactory: () => {
          throw new BadRequestException('Id parameter must be a valid number');
        },
      }),
    )
    id: number,
    @Request() req: RequestWithUser,
  ) {
    return this.blogService.findPrivateBlog(id, req.user.sub);
  }
}
