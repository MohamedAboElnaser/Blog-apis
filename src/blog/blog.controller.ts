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

@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @FormDataRequest()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
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
}
