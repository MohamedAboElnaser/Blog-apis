import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

export class UserDTO {
  @ApiProperty({
    description: 'ID of User',
    example: 1,
  })
  id: number;
  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
  })
  lastName: string;

  @ApiProperty({
    description: 'User Bio',
    example: 'Backend Engineer ...',
  })
  bio: string;

  @ApiProperty({
    description: 'User profile photo URL',
    example: 'https://example.com/photos/user_1.jpg',
  })
  photo_url: string;
}
export class UsersResponseDto {
  @ApiProperty({
    description: 'List of users',
    type: [UserDTO],
  })
  users: UserDTO[];

  @ApiProperty({
    description: 'Pagination information',
    type: PaginationDto,
  })
  pagination: PaginationDto;
}
