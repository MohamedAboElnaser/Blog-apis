import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsNumber, Min, Max } from 'class-validator';

export class VerifyEmailDTO {
  @ApiProperty({
    description: 'User email address that needs verification',
    example: 'username@example.com',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Six-digit verification code sent to the user email',
    example: 123456,
    required: true,
    minimum: 100000,
    maximum: 999999,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(100000)
  @Max(999999)
  otp: number;
}
