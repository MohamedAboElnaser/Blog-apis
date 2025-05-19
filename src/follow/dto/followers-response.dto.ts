import { ApiProperty } from '@nestjs/swagger';
import { UserFollowDto } from './user-follow.dto';
import { PaginationDto } from './pagination.dto';

export class FollowersResponseDto {
  @ApiProperty({
    description: 'List of users who follow the specified user',
    type: [UserFollowDto],
  })
  followers: UserFollowDto[];

  @ApiProperty({
    description: 'Pagination information',
    type: PaginationDto,
  })
  pagination: PaginationDto;
}
