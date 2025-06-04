import { ApiProperty } from '@nestjs/swagger';

export class BlogDto {
  @ApiProperty({
    description: 'Unique identifier of the blog post',
    example: 1,
  })
  id: number;

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
    example: true,
  })
  isPublic: boolean;

  @ApiProperty({ description: 'Date when the blog was created' })
  createdAt: Date;
}
