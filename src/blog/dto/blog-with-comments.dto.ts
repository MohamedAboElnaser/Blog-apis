import { ApiProperty } from '@nestjs/swagger';
import { CommentWithAuthorDto } from 'src/comment/dto/comment-with.author.dto';
import { BlogWithAuthorDto } from './blog-with-author.dto';

export class BlogWithComments extends BlogWithAuthorDto {
  @ApiProperty({
    description: 'Array of comments',
    type: [CommentWithAuthorDto],
  })
  comments: CommentWithAuthorDto[];
}
