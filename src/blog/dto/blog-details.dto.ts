import { ApiProperty } from '@nestjs/swagger';
import { BlogWithAuthorDto } from './blog-with-author.dto';

export class BlogDetailsDto {
  @ApiProperty({
    description: 'Blog object',
    type: BlogWithAuthorDto,
  })
  blog: BlogWithAuthorDto;

  @ApiProperty({
    description: 'Number of Comments on this blog',
    example: 15,
  })
  commentsCount: number;
  @ApiProperty({
    description: 'Number of likes on this blog',
    example: 15,
  })
  likesCount: number;

  @ApiProperty({
    description: 'Whether the current user has liked this blog',
    example: true,
  })
  isLikedByCurrentUser?: boolean;
}
