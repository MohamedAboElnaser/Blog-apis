import { ApiProperty } from '@nestjs/swagger';

export class CommentResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the comment',
    example: 1,
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: 'The content of the comment',
    example: 'This is a very insightful blog post. Thanks for sharing!',
  })
  body: string;

  @ApiProperty({
    description: 'ID of the blog post this comment belongs to',
    example: 5,
    type: Number,
  })
  blogId: number;

  @ApiProperty({
    description: 'ID of the user who authored the comment',
    example: 3,
    type: Number,
  })
  authorId: number;

  @ApiProperty({
    description: 'Date and time when the comment was created',
    example: '2025-05-14T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date and time when the comment was last updated',
    example: '2025-05-14T11:15:00Z',
  })
  updatedAt: Date;
}
