import { ApiProperty } from '@nestjs/swagger';
import { BlogWithComments } from './blog-with-comments.dto';

export class BlogDetailsDto {
  @ApiProperty({
    description: 'Blog object',
    type: [BlogWithComments],
  })
  blog: BlogWithComments;

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
