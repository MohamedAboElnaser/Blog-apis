import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailResponseDto {
  @ApiProperty({
    description: 'Success message confirming email verification',
    example: 'Email verified successfully. Now you can login',
  })
  message: string;
}
