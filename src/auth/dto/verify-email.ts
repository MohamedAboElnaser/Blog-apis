import { IsEmail } from 'class-validator';

export class VerifyEmailDTO {
  @IsEmail()
  email: string;
}
