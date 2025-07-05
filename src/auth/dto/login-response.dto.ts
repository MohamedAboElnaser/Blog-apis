import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({
    description: 'Success message confirming successful login',
    example: 'Login successful',
  })
  message: string;

  @ApiProperty({
    description: 'JWT auth token for authenticated requests',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZW1haWwiOiJ1c2VyQGV4YW1wbGUuY29tIiwiaWF0IjoxNjE5MDEyMzQ1LCJleHAiOjE2MTkwOTg3NDV9.abc123def456',
  })
  access_token: string;
}
