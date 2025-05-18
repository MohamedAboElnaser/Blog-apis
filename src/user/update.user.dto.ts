import { PartialType, OmitType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { RegisterDTO } from 'src/auth/dto/register-dto';

export class UpdateUserDto extends PartialType(
  OmitType(RegisterDTO, ['password']),
) {
  @ApiProperty({
    description: 'Valid user email address',
    example: 'username@example.com',
    required: false,
  })
  email?: string;

  @ApiProperty({
    description: 'User first Name',
    minLength: 3,
    maxLength: 10,
    example: 'John',
    required: false,
  })
  firstName?: string;

  @ApiProperty({
    description: 'User last Name',
    minLength: 3,
    maxLength: 10,
    example: 'Doe',
    required: false,
  })
  lastName?: string;
}
