import {
  ForbiddenException,
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

  async findAll(authorId: number) {
    return await this.blogsRepository.findBy({ authorId });
  }

  async findOne(id: number) {
    const blog = await this.blogsRepository.findOne({
      where: { id },
      relations: { comments: true },
    });
    if (!blog) throw new NotFoundException('Blog not found');
    if (!blog.isPublic)
      throw new ForbiddenException(`Blog with id ${id} is private`);
    return blog;
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

  async remove(id: number, authorId: number) {
    // Find the blog to make sure it exists
    const blog = await this.blogsRepository.findOneBy({ id, authorId });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }
    await this.blogsRepository.remove(blog);
  }

  async findPrivateBlog(blogId: number, authorId: number) {
    const blog = await this.blogsRepository.findOne({
      where: { id: blogId, authorId, isPublic: false },
      relations: { comments: true },
    });

    if (!blog)
      throw new NotFoundException(`No private blog found with id ${blogId}`);

    return blog;
  }
}
