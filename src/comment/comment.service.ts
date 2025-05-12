import {
  ForbiddenException,
  Injectable,
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
      throw new ForbiddenException(
        'You are not Authorized to add comment to this blog',
      );

    const comment = await this.commentRepository.save(data);
    return comment;
  }

  findAll() {
    return `This action returns all comment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  async update(
    id: number,
    data: {
      blogId: number;
      updateCommentDto: UpdateCommentDto;
      authorId: number;
    },
  ) {
    //Check if the comment exist
    const comment = await this.commentRepository.findOne({
      where: { id, blogId: data.blogId },
      relations: { blog: true },
    });
    if (!comment)
      throw new NotFoundException(`Comment with id ${id} not found`);

    //Verify that only the comment author can updated his own
    if (comment.authorId !== data.authorId)
      throw new ForbiddenException(`You only can update Your own comments`);

    if (!comment.blog.isPublic)
      throw new ForbiddenException('Cannot update comments on a private blog!');

    Object.assign(comment, data.updateCommentDto);
    return await this.commentRepository.save(comment);
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
