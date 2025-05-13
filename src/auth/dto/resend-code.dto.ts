import { ApiProperty } from '@nestjs/swagger';

export class ResendCodeResponseDto {
  @ApiProperty({
    description: 'Success message confirming verification code was resent',
    example: 'Verification code sent successfully to user@example.com',
  })
  message: string;
}
