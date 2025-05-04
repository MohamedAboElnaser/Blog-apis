import { IsEmail, IsNotEmpty } from 'class-validator';

export class VerifyEmailDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
