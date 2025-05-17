import { ApiProperty } from '@nestjs/swagger';

export class UploadProfilePictureRequestDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Profile image file (max 5MB)',
    required: true,
  })
  image: Express.Multer.File;
}
