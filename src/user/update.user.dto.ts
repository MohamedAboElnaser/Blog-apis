import { PartialType, OmitType } from '@nestjs/mapped-types';
import { RegisterDTO } from 'src/auth/dto/register-dto';

export class UpdateUserDto extends PartialType(
  OmitType(RegisterDTO, ['password']),
) {}
