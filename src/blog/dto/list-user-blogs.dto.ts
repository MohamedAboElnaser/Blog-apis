import { ApiProperty } from '@nestjs/swagger';
import { BlogResponseDto } from './create-blog-response.dto';
import { Type } from 'class-transformer';

export class BlogsListResponseDto {
  @ApiProperty({
    description: 'Total number of blogs found',
    example: 1,
  })
  count: number;

  @ApiProperty({
    description: 'List of blogs',
    type: [BlogResponseDto],
  })
  @Type(() => BlogResponseDto)
  blogs: BlogResponseDto[];
}
