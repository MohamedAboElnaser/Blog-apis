import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Valid user email address',
    example: 'username@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email?: string;

  @ApiProperty({
    description: 'User first Name',
    minLength: 3,
    maxLength: 10,
    example: 'John',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'First name must be a string' })
  @Length(3, 10, { message: 'First name must be between 3 and 10 characters' })
  firstName?: string;

  @ApiProperty({
    description: 'User last Name',
    minLength: 3,
    maxLength: 10,
    example: 'Doe',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Last name must be a string' })
  @Length(3, 10, { message: 'Last name must be between 3 and 10 characters' })
  lastName?: string;

  @ApiProperty({
    description: 'Bio of User',
    minLength: 1,
    maxLength: 150,
    example: 'Backend engineer | pla pla pla ',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Bio must be a string' })
  @Length(3, 150, { message: 'Bio must be between 3 and 150 characters' })
  bio?: string;
}
