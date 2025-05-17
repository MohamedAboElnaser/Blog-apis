import {
  Controller,
  Delete,
  Get,
  NotImplementedException,
  UseGuards,
  Request,
  Patch,
  Body,
  UsePipes,
  ValidationPipe,
  Param,
  ParseIntPipe,
  BadRequestException,
  HttpStatus,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { RequestWithUser } from 'src/auth/types/request.type';
import { UpdateUserDto } from './update.user.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { BlogResponseDto } from 'src/blog/dto/blog-response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadProfilePictureResponseDto } from './dto/upload-profile-picture.response.dto';
import { UploadProfilePictureRequestDto } from './dto/upload-profile-picture.request.dto';

@ApiTags('Users')
@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('/me')
  get() {
    throw new NotImplementedException();
  }

  @Patch('/me')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @UseGuards(AuthGuard)
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: RequestWithUser,
  ) {
    console.log(`UpdateUserDto data : ${updateUserDto}`);
    return await this.userService.update(req.user.sub, updateUserDto);
  }

  @Get('/:id/blogs')
  @ApiOperation({
    summary: "Get user's public blogs",
    description: 'Retrieves all public blogs created by a specific user',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Public blogs retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        count: { type: 'number', example: 1 },
        blogs: {
          type: 'array',
          items: { $ref: getSchemaPath(BlogResponseDto) },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found - User does not exist',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request - Invalid user ID format',
  })
  async getUserPublicBlogs(
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
    const blogs = await this.userService.getPublicBlogs(id);
    return {
      count: blogs.length,
      blogs,
    };
  }

  @Delete('/me')
  @ApiOperation({
    summary: 'Delete current user account',
    description:
      'Permanently removes the authenticated user account and all associated data',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User successfully deleted',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - User not authenticated',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found - User does not exist',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error - Failed to delete user',
  })
  @UseGuards(AuthGuard)
  async remove(@Request() req: RequestWithUser) {
    await this.userService.delete(req.user.sub);

    return { message: 'User Deleted successfully' };
  }

  @Post('profile-picture')
  @ApiOperation({
    summary: 'Upload profile picture',
    description:
      "Upload or replace the authenticated user's profile picture (max 5MB)",
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Profile picture uploaded successfully',
    type: UploadProfilePictureResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Bad Request - No file uploaded or file size exceeds 5MB or file uploaded is not an image',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - User not authenticated',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UploadProfilePictureRequestDto,
  })
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  async uploadProfilePicture(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: RequestWithUser,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const url = await this.userService.uploadUserImage(file, req.user.sub);

    return { photo_url: url };
  }
}
