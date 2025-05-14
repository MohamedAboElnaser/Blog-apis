import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBlogDto {
  @ApiProperty({
    description: 'The title of the blog post',
    example: 'My First Blog Post',
    minLength: 2,
    maxLength: 20,
  })
  @Length(2, 20)
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'The main content of the blog post',
    example:
      'This is the content of my first blog post. It can be a long text with details about the topic.',
  })
  @IsNotEmpty()
  body: string;

  @ApiProperty({
    description: 'Flag indicating whether the blog is public or private',
    example: true,
    type: Boolean,
  })
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  isPublic: boolean;
}
