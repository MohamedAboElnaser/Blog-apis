import { ApiProperty } from '@nestjs/swagger';
import { BlogDto } from './blog.dto';
import { AuthorDto } from 'src/user/dto/author.dto';

export class BlogWithAuthorDto extends BlogDto {
  @ApiProperty({
    description: 'Author object',
    type: AuthorDto,
  })
  author: AuthorDto;
}
