import { ApiProperty } from '@nestjs/swagger';

export class UserProfileDto {
  @ApiProperty({
    description: 'Unique identifier of the User',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'First name of the User',
    example: 'John',
  })
  firstName: string;

  @ApiProperty({
    description: 'Last name of the User',
    example: 'Doe',
  })
  lastName: string;

  @ApiProperty({ description: 'User Email', example: 'username@example.com' })
  email: string;

  @ApiProperty({
    description: 'Bio of the User',
    example: 'Backend Engineer | ...',
  })
  bio: string;

  @ApiProperty({
    description: 'Profile photo URL of the User',
    example: 'https://avatar.iran.liara.run/public/1',
  })
  photo_url: string;
}
