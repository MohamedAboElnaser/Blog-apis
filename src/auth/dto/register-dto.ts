import { IsEmail, Length, IsNotEmpty, IsOptional } from 'class-validator';

export class RegisterDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Length(8, 20)
  password: string;

  @IsNotEmpty()
  @Length(3, 10)
  firstName: string;

  @IsOptional()
  @Length(3, 10)
  lastName: string;
}
