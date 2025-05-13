import { IsEmail, Length, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDTO {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Valid user email address',
    example: 'username@example.com',
  })
  email: string;

  @Length(8, 20)
  @ApiProperty({
    description: 'User password (min 8 characters)',
    example: 'veryStrongPassword',
    minLength: 8,
  })
  password: string;

  @IsNotEmpty()
  @Length(3, 10)
  @ApiProperty({
    description: 'User first Name',
    minLength: 3,
    maxLength: 10,
    example: 'John',
  })
  firstName: string;

  @IsOptional()
  @Length(3, 10)
  @ApiPropertyOptional({
    description: 'User last Name',
    minLength: 3,
    maxLength: 10,
    example: 'Doe',
  })
  lastName: string;
}
