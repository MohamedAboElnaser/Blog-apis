import {
  Controller,
  Delete,
  Get,
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
  DefaultValuePipe,
  Query,
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
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadProfilePictureResponseDto } from './dto/upload-profile-picture.response.dto';
import { UploadProfilePictureRequestDto } from './dto/upload-profile-picture.request.dto';
import { UsersResponseDto } from './dto/users-response.dto';
import { OptionalAuthGuard } from 'src/auth/optional-auth.guard';
import { PublicBlogsResponseDto } from 'src/blog/dto/blogs-with-states.dto';
import { FormDataRequest } from 'nestjs-form-data';
import { UserDto } from './dto/user.dto';
import { UserProfileDto } from './dto/user-profile.dto';

@ApiTags('Users')
@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('/me')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Return current authenticated user data',
    description:
      'Retrieves the profile information of the currently authenticated user',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User data retrieved successfully',
    type: UserProfileDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - User not authenticated',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found - User does not exist',
  })
  @UseGuards(AuthGuard)
  async get(@Request() req: RequestWithUser) {
    return await this.userService.getUserData(req.user.sub);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all users',
    description: 'Retrieves a paginated list of all users',
  })
  @ApiQuery({
    name: 'page',
    description: 'Page number for pagination',
    type: Number,
    required: false,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Number of users per page',
    type: Number,
    required: false,
    example: 10,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Users retrieved successfully',
    type: UsersResponseDto,
  })
  async getUsers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ) {
    return await this.userService.getUsers(page, limit);
  }

  @Patch('/me')
  @ApiOperation({
    summary: 'Update user profile',
    description:
      'Updates the profile information of the currently authenticated user',
  })
  @ApiConsumes('application/json', 'multipart/form-data')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User profile updated successfully',
    type: UserDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - User not authenticated',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request - Invalid data provided',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found - User does not exist',
  })
  @ApiBody({ type: UpdateUserDto })
  @FormDataRequest()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: RequestWithUser,
  ) {
    return await this.userService.update(req.user.sub, updateUserDto);
  }

  @Get('/:id/blogs')
  @UseGuards(OptionalAuthGuard)
  @ApiBearerAuth() //this is optional
  @ApiOperation({
    summary: "Get user's public blogs",
    description: `Retrieves all public blogs created by a specific user. Authentication is optional - if authenticated, may return additional information or personalized content.`,
  })
  @ApiQuery({
    name: 'page',
    description: 'Page number for pagination',
    type: Number,
    required: false,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Number of items per page',
    type: Number,
    required: false,
    example: 10,
  })
  @ApiParam({
    name: 'id',
    description: 'User ID to retrieve blogs for',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Public blogs retrieved successfully',
    type: PublicBlogsResponseDto,
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
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Request() req: RequestWithUser,
  ) {
    const currentUserId = req?.user?.sub;
    return await this.userService.getPublicBlogs(
      id,
      page,
      limit,
      currentUserId,
    );
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
      fileFilter: (req, file, callback) => {
        const allowedMimeTypes = [
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/webp',
          'image/svg+xml',
        ];
        if (!allowedMimeTypes.includes(file.mimetype)) {
          return callback(
            new BadRequestException(
              `File type not allowed. Accepted types: ${allowedMimeTypes.join(', ')}`,
            ),
            false,
          );
        }
        callback(null, true);
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
