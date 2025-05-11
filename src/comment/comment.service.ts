import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from 'src/blog/entities/blog.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Blog) private blogRepository: Repository<Blog>,
  ) {}
  async create(data: { authorId: number; blogId: number; body: string }) {
    //Make sure that blog exist
    const blog = await this.blogRepository.findOneBy({ id: data.blogId });

    if (!blog)
      throw new NotFoundException(`Blog with id ${data.blogId} Not found`);

    //Make sure that blog is public
    if (!blog.isPublic)
      throw new NotAcceptableException('Cannot comment on a private blog');

    const comment = await this.commentRepository.save(data);
    return comment;
  }

  findAll() {
    return `This action returns all comment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
