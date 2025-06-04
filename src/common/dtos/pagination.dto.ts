import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
  @ApiProperty({
    description: 'Total number of items',
    example: 1,
  })
  total: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 5,
  })
  limit: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 1,
  })
  totalPages: number;
}
