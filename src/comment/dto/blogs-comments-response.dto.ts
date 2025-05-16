import { ApiProperty } from '@nestjs/swagger';
import { CommentResponseDto } from './comment-response-dto';

export class BlogCommentsResponseDto {
  @ApiProperty({
    description: 'ID of the blog',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Title of the blog',
    example: 'Introduction to NestJS',
  })
  title: string;

  @ApiProperty({
    description: 'Content of the blog',
    example:
      'NestJS is a framework for building efficient server-side applications...',
  })
  content: string;

  @ApiProperty({
    description: 'Whether the blog is public',
    example: true,
  })
  isPublic: boolean;

  @ApiProperty({
    description: 'ID of the blog author',
    example: 5,
  })
  authorId: number;

  @ApiProperty({
    description: 'When the blog was created',
    example: '2025-05-10T10:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'When the blog was last updated',
    example: '2025-05-12T15:30:00Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'List of comments on this blog',
    type: [CommentResponseDto],
  })
  comments: CommentResponseDto[];
}
