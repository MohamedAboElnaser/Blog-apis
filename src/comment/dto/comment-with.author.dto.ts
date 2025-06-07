import { AuthorDto } from 'src/user/dto/author.dto';
import { CommentResponseDto } from './comment-response-dto';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

export class CommentWithAuthorDto extends CommentResponseDto {
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
    description: 'Date and time when the comment was created',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Author object',
    type: AuthorDto,
  })
  author: AuthorDto;
}

export class CommentWithAuthorDtoRes {
  @ApiProperty({
    description: 'Array of Comments',
    type: [CommentWithAuthorDto],
  })
  comments: CommentWithAuthorDto[];

  @ApiProperty({
    description: 'Pagination information',
    type: PaginationDto,
  })
  pagination: PaginationDto;
}
