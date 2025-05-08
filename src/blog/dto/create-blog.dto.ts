import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, Length } from 'class-validator';

export class CreateBlogDto {
  @Length(2, 15)
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  body: string;

  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  isPublic: boolean;
}
