import { ApiProperty } from '@nestjs/swagger';

export class AuthorDto {
  @ApiProperty({
    description: 'Unique identifier of the author',
    example: 3,
  })
  id: number;

  @ApiProperty({
    description: 'First name of the author',
    example: 'John',
  })
  firstName: string;

  @ApiProperty({
    description: 'Last name of the author',
    example: 'Doe',
  })
  lastName: string;

  @ApiProperty({
    description: 'Profile photo URL of the author',
    example: 'https://avatar.iran.liara.run/public/1',
  })
  photo_url: string;
}
