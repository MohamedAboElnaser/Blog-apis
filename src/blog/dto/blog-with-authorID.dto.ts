import { ApiProperty } from '@nestjs/swagger';
import { BlogDto } from './blog.dto';

export class BlogWithAuthorId extends BlogDto {
  @ApiProperty({
    description: 'Author Id of the Blog Which is the Id of the current user',
    type: Number,
    example: 1,
  })
  authorId: number;

  @ApiProperty({ description: 'Date when the blog was last updated' })
  updatedAt: Date;
}
