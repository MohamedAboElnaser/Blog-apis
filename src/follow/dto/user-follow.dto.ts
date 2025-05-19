import { ApiProperty } from '@nestjs/swagger';

export class UserFollowDto {
  @ApiProperty({
    description: 'User ID',
    example: 34,
  })
  id: number;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  firstName: string;

  @ApiProperty({
    description: 'User profile photo URL',
    example: 'https://storage.example.com/uploads/filename.ext',
  })
  photo_url: string;
}
