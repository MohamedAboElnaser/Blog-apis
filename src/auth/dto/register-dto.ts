import { IsEmail, Length, IsNotEmpty, IsOptional } from 'class-validator';

export class RegisterDTO {
  @IsEmail()
  email: string;

  @Length(8, 20)
  password: string;

  @IsNotEmpty()
  @Length(3, 10, { message: 'firstName must be between 3 and 10 characters' })
  firstName: string;

  @IsOptional()
  @Length(3, 10)
  lastName: string;
}
