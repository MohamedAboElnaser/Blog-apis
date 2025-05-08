import { Injectable, InternalServerErrorException } from '@nestjs/common';
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

  findAll() {
    return `This action returns all blog`;
  }

  findOne(id: number) {
    return `This action returns a #${id} blog`;
  }

  update(id: number, updateBlogDto: UpdateBlogDto) {
    return `This action updates a #${id} blog`;
  }

  remove(id: number) {
    return `This action removes a #${id} blog`;
  }
}
