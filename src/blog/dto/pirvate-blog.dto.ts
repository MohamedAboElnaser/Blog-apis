import { ApiProperty } from '@nestjs/swagger';

export class PrivateBlogDto {
  @ApiProperty({
    description: 'Unique identifier of the blog post',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Author Id of the Blog Which is the Id of the current user',
    type: Number,
    example: 1,
  })
  authorId: number;

  @ApiProperty({
    description: 'Title of the blog post',
    example: 'My First Blog',
  })
  title: string;

  @ApiProperty({
    description: 'Content of the blog post',
    example: 'This is my blog content...',
  })
  body: string;

  @ApiProperty({
    description: 'Flag indicating if the blog is publicly visible',
    example: false,
  })
  isPublic: boolean;

  @ApiProperty({ description: 'Date when the blog was created' })
  createdAt: Date;

  @ApiProperty({ description: 'Date when the blog was last updated' })
  updatedAt: Date;
}
