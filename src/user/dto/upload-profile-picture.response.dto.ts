import { ApiProperty } from '@nestjs/swagger';

export class UploadProfilePictureResponseDto {
  @ApiProperty({
    description: 'Public url of the uploaded picture',
    example: 'https://storage.example.com/uploads/filename.ext',
  })
  photo_url: string;
}
