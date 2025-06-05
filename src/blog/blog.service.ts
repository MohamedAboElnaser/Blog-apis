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
import { LikeService } from 'src/like/like.service';
import { CommentService } from 'src/comment/comment.service';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog) private blogsRepository: Repository<Blog>,
    private likeService: LikeService,
    private commentService: CommentService,
  ) {}
  async create(createBlogDto: CreateBlogServiceDto) {
    try {
      return await this.blogsRepository.save(createBlogDto);
    } catch (err) {
      console.log('Error happen while creating Blog', err);
      throw new InternalServerErrorException();
    }
  }

  async findAll(authorId: number, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [blogs, total] = await this.blogsRepository.findAndCount({
      where: { authorId },
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
      select: {
        id: true,
        title: true,
        body: true,
        createdAt: true,
        isPublic: true,
      },
    });

    return {
      blogs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number, userId?: number) {
    const blog = await this.blogsRepository.findOne({
      where: { id },
      relations: ['author'],
      select: {
        body: true,
        id: true,
        title: true,
        isPublic: true,
        createdAt: true,
        author: {
          id: true,
          firstName: true,
          lastName: true,
          photo_url: true,
        },
      },
    });
    if (!blog) throw new NotFoundException(`No blog found with id: ${id}`);
    if (!blog.isPublic)
      throw new ForbiddenException(`Blog with id ${id} is private`);

    //Count total comments
    const commentsCount = await this.commentService.getBlogCommentsCount(id);

    //Count number of likes at this blog
    const likesCount = await this.likeService.getBlogLikeCount(id);

    // See if the current user liked this Blog
    const isLikedByCurrentUser = await this.likeService.hasUserLikedBlog(
      userId,
      id,
    );
    return {
      blog,
      commentsCount,
      likesCount,
      isLikedByCurrentUser,
    };
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

  async getUserPublicBlogs(
    authorId: number,
    page: number = 1,
    limit: number = 10,
    currentUserId?: number,
  ) {
    const skip = (page - 1) * limit;

    const queryBuilder = this.blogsRepository
      .createQueryBuilder('blog')
      .leftJoin('blog.likes', 'like')
      .leftJoin('blog.comments', 'comment')
      .leftJoin('blog.likes', 'userLike', 'userLike.userId = :currentUserId', {
        currentUserId,
      })
      .select(['blog.id', 'blog.title', 'blog.body', 'blog.createdAt'])
      .addSelect('COUNT(DISTINCT like.id)', 'likesCount')
      .addSelect('COUNT(DISTINCT comment.id)', 'commentsCount')
      .addSelect('COUNT(DISTINCT userLike.id) > 0', 'isLikedByCurrentUser')
      .where('blog.authorId = :authorId', { authorId })
      .andWhere('blog.isPublic = true')
      .groupBy('blog.id')
      .orderBy('blog.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    const [blogs, total] = await Promise.all([
      queryBuilder.getRawAndEntities(),
      this.blogsRepository.count({ where: { authorId, isPublic: true } }),
    ]);

    const blogsWithCounts = blogs.entities.map((blog, index) => ({
      ...blog,
      likesCount: parseInt(blogs.raw[index].likesCount),
      commentsCount: parseInt(blogs.raw[index].commentsCount),
      isLikedByCurrentUser:
        blogs.raw[index].isLikedByCurrentUser === '1' ||
        blogs.raw[index].isLikedByCurrentUser === true,
    }));

    return {
      blogs: blogsWithCounts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
