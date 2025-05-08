import { CreateBlogDto } from './create-blog.dto';

export class CreateBlogServiceDto extends CreateBlogDto {
  authorId: number;
}
