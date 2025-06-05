import { ApiProperty } from '@nestjs/swagger';
import { BlogDto } from './blog.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

class BlogWithStatsDto extends BlogDto {
  @ApiProperty({
    description: 'Number of Comments on this blog',
    example: 5,
  })
  commentsCount: number;
  @ApiProperty({
    description: 'Number of likes on this blog',
    example: 3,
  })
  likesCount: number;

  @ApiProperty({
    description: 'Whether the current user has liked this blog',
    example: true,
  })
  isLikedByCurrentUser?: boolean;
}

export class PublicBlogsResponseDto {
  @ApiProperty({
    description: 'Blogs Array',
    type: [BlogWithStatsDto],
  })
  blog: BlogWithStatsDto;

  @ApiProperty({
    description: 'Pagination Object',
    type: PaginationDto,
  })
  pagination: PaginationDto;
}
