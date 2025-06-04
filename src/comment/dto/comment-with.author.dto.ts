import { AuthorDto } from 'src/user/dto/author.dto';
import { CommentResponseDto } from './comment-response-dto';
import { ApiProperty } from '@nestjs/swagger';

export class CommentWithAuthorDto extends CommentResponseDto {
  @ApiProperty({
    description: 'Author object',
    type: [AuthorDto],
  })
  author: AuthorDto;
}
