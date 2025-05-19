import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Reset token received via email',
    example: '123456',
    required: true,
  })
  @IsNotEmpty()
  code: number;

  @ApiProperty({
    description: 'User Email',
    example: 'user@example.com',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'New password (min 8 chars)',
    example: 'NewSecurePass123',
    required: true,
    minLength: 8,
  })
  @IsNotEmpty()
  @Length(8, 20)
  password: string;
}
