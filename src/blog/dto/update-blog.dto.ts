import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBlogDto {
  @ApiProperty({
    description: 'The updated title of the blog post',
    example: 'My Updated Blog Title',
    minLength: 2,
    maxLength: 50,
    required: false,
  })
  @IsOptional()
  @Length(2, 50)
  title?: string;

  @ApiProperty({
    description: 'The updated content of the blog post',
    example:
      'This is the revised content of my blog post with additional details and improvements.',
    required: false,
  })
  @IsOptional()
  body?: string;

  @ApiProperty({
    description: 'Updated visibility status of the blog post',
    example: false,
    type: Boolean,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  isPublic?: boolean;
}
