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
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { RegisterResponseDto } from './dto/register-response.dto';
import { VerifyEmailResponseDto } from './dto/verify-email-response.dto';
import { LoginResponseDto } from './dto/login-response.dto';

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
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verify user email',
    description:
      'Validates the verification code sent to the user email during registration',
  })
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiBody({ type: VerifyEmailDTO })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Email verified successfully',
    type: VerifyEmailResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid verification code or already verified email',
  })
  @ApiInternalServerErrorResponse({
    description: 'An unexpected error occurred',
  })
  async verify(@Body() body: VerifyEmailDTO) {
    await this.authService.verify(body);
    return {
      message: `Email Verified successfully , Now you can Login`,
    };
  }

  @Post('login')
  @FormDataRequest()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'User login',
    description:
      'Authenticates a user and returns a JWT token for authorized API access',
  })
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiBody({ type: LoginDTO })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login successful',
    type: LoginResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Wrong password' })
  @ApiNotFoundResponse({ description: 'Email is not registered!' })
  @ApiBadRequestResponse({
    description: 'Email already verified, You can login',
  })
  @ApiBadRequestResponse({ description: 'Email not verified' })
  @ApiInternalServerErrorResponse({
    description: 'An unexpected error occurred',
  })
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
