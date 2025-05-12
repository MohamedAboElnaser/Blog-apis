import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsNumber, Min, Max } from 'class-validator';

export class VerifyEmailDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(100000)
  @Max(999999)
  otp: number;
}
