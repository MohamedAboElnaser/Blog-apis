import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './entities/like.entity';
import { Blog } from 'src/blog/entities/blog.entity';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like) private likeRepo: Repository<Like>,
    @InjectRepository(Blog) private blogRepo: Repository<Blog>,
  ) {}

  async likeBlog(userId: number, blogId: number) {
    // Check if blog exists and is public
    const blog = await this.blogRepo.findOneBy({ id: blogId });
    if (!blog) {
      throw new NotFoundException(`Blog with id ${blogId} not found`);
    }
    if (!blog.isPublic) {
      throw new ForbiddenException('Cannot like a private blog');
    }

    // Check if already liked
    const existingLike = await this.likeRepo.findOneBy({ userId, blogId });
    if (existingLike) {
      throw new BadRequestException('You have already liked this blog');
    }

    const like = this.likeRepo.create({ userId, blogId });
    await this.likeRepo.save(like);

    return { message: 'Blog liked successfully' };
  }
}
