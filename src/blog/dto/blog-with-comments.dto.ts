import { ApiProperty } from '@nestjs/swagger';
import { BlogDto } from './blog.dto';
import { CommentWithAuthorDto } from 'src/comment/dto/comment-with.author.dto';

export class BlogWithComments extends BlogDto {
  @ApiProperty({
    description: 'Array of comments',
    type: [CommentWithAuthorDto],
  })
  comments: CommentWithAuthorDto[];
}
