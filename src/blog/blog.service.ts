import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Blog } from './entities/blog.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBlogServiceDto } from './dto/create-blog-service.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog) private blogsRepository: Repository<Blog>,
  ) {}
  async create(createBlogDto: CreateBlogServiceDto) {
    try {
      return await this.blogsRepository.save(createBlogDto);
    } catch (err) {
      console.log('Error happen while creating Blog', err);
      throw new InternalServerErrorException();
    }
  }

  async findAll(authorId: number = 1) {
    return await this.blogsRepository.findBy({ authorId });
  }

  async findOne(id: number) {
    return 'this return single blog';
  }

  async update(id: number, authorId: number, updateBlogDto: UpdateBlogDto) {
    // Find the blog to make sure it exists
    const blog = await this.blogsRepository.findOneBy({ id, authorId });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    // Update the blog with the new data
    const updatedBlog = await this.blogsRepository.update(id, updateBlogDto);

    // Return the updated blog
    if (updatedBlog.affected > 0) {
      return await this.blogsRepository.findOneBy({ id });
    } else {
      throw new InternalServerErrorException('Failed to update blog');
    }
  }

  remove(id: number) {
    return `This action removes a #${id} blog`;
  }
}
