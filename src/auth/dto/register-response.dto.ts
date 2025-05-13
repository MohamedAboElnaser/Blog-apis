import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../user/dto/user.dto';

export class RegisterResponseDto {
  @ApiProperty({
    example:
      'User registered successfully, Check username@example.com for Verification code',
    description: 'Success message with information about next steps',
  })
  message: string;

  @ApiProperty({
    description: 'The created user data',
    type: UserDto,
  })
  user: UserDto;
}
