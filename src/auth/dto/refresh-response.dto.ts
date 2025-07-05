import { ApiProperty } from '@nestjs/swagger';

export class RefreshResponseDto {
  @ApiProperty({
    description: 'Success message confirming successful token refresh',
    example: 'Token refreshed successfully',
  })
  message: string;

  @ApiProperty({
    description: 'JWT access token for authenticated requests',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX9.eyJzdWIiOiIxIiwiZW1haW.abc123def456',
  })
  access_token: string;
}
