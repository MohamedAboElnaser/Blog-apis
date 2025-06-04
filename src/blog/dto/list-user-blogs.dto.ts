import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { BlogDto } from './blog.dto';

export class BlogsListResponseDto {
  @ApiProperty({
    description: 'List of blogs',
    type: [BlogDto],
  })
  @Type(() => BlogDto)
  blogs: BlogDto[];

  @ApiProperty({
    description: 'Pagination information',
    type: PaginationDto,
  })
  pagination: PaginationDto;
}
