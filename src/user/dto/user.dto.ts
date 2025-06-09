import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'username@example.com' })
  email: string;

  @ApiProperty({ example: 'John' })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @ApiProperty({
    example: 'Backend engineer | pla pla pla ',
    description: 'Bio of the user',
  })
  bio: string;

  @ApiProperty({ example: false })
  isVerified: boolean;

  @ApiProperty({ example: '2025-05-13T12:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-05-13T12:00:00Z' })
  updatedAt: Date;
}
