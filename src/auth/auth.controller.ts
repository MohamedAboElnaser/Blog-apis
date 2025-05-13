import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UsePipes,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RegisterDTO } from './dto/register-dto';
import { VerifyEmailDTO } from './dto/verify-email-dto';
import { LoginDTO } from './dto/login-dto';
import { FormDataRequest } from 'nestjs-form-data';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { ResendCodeDto } from './dto/resend-otp';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiConflictResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiResponse,
  ApiConsumes,
} from '@nestjs/swagger';
import { RegisterResponseDto } from './dto/register-response.dto';

@ApiTags('Auth')
@Controller('auth')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}
  @Post('register')
  @FormDataRequest()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register a new user',
    description:
      'Creates a user account and sends a verification code to the provided email',
  })
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiBody({ type: RegisterDTO })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description:
      'User registered successfully, check your mail for verification',
    type: RegisterResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiConflictResponse({ description: 'Email already used' })
  @ApiInternalServerErrorResponse({
    description: 'An unexpected error occurred',
  })
  async register(
    @Body()
    body: RegisterDTO,
  ) {
    const user = await this.userService.add(body);
    return {
      message: `User registered successfully , Check ${user.email} for Verification code`,
      user,
    };
  }
  @Post('verify-email')
  @FormDataRequest()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async verify(@Body() body: VerifyEmailDTO) {
    await this.authService.verify(body);
    return {
      message: `Email Verified successfully , Now you can Login`,
    };
  }

  @Post('login')
  @FormDataRequest()
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async login(
    @Body()
    body: LoginDTO,
  ) {
    const token = await this.authService.login(body);
    return {
      message: `Login successfully`,
      token,
    };
  }

  @Post('resend-verification-code')
  @FormDataRequest()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async resendVerificationCode(@Body() body: ResendCodeDto) {
    return await this.authService.resendVerificationCode(body);
  }
}
