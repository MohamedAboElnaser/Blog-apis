import { ApiProperty } from '@nestjs/swagger';
import { UserFollowDto } from './user-follow.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

export class FollowingsResponseDto {
  @ApiProperty({
    description: 'List of users being followed',
    type: [UserFollowDto],
  })
  followings: UserFollowDto[];

  @ApiProperty({
    description: 'Pagination information',
    type: PaginationDto,
  })
  pagination: PaginationDto;
}
