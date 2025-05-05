import { IsEmail, IsNotEmpty, IsNumber, Min, Max } from 'class-validator';

export class VerifyEmailDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNumber()
  @Min(100000)
  @Max(999999)
  @IsNotEmpty()
  otp: number;
}
