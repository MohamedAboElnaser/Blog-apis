import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Blog } from '../../blog/entities/blog.entity';
import { Comment } from '../../comment/entities/comment.entity';
import { Like } from '../../like/entities/like.entity';
import { Follow } from '../../follow/entities/follow.entity';
import { users } from '../data/users.data';

@Injectable()
export class DatabaseSeeder {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Blog) private blogRepo: Repository<Blog>,
    @InjectRepository(Comment) private commentRepo: Repository<Comment>,
    @InjectRepository(Like) private likeRepo: Repository<Like>,
    @InjectRepository(Follow) private followRepo: Repository<Follow>,
  ) {}

  async seed() {
    console.log('🌱 Starting database seeding...');

    // Check if data already exists
    const userCount = await this.userRepo.count();
    if (userCount > 0) {
      console.log(
        '📊 Database already contains data. Skipping seeding process.',
      );
      return;
    }

    await this.seedUsers();
    await this.seedBlogs();
    await this.seedComments();
    await this.seedLikes();
    await this.seedFollows();

    console.log('✅ Database seeding completed!');
  }

  async forceSeed() {
    console.log('🌱 Starting FORCE database seeding...');
    console.log('⚠️  This will clear all existing data!');

    await this.clearDatabase();
    await this.seedUsers();
    await this.seedBlogs();
    await this.seedComments();
    await this.seedLikes();
    await this.seedFollows();

    console.log('✅ Force database seeding completed!');
  }

  private async clearDatabase() {
    console.log('🧹 Clearing existing data...');
    await this.followRepo.delete({});
    await this.likeRepo.delete({});
    await this.commentRepo.delete({});
    await this.blogRepo.delete({});
    await this.userRepo.delete({});
  }

  private async seedUsers() {
    console.log('👥 Seeding users...');

    for (const userData of users) {
      const existingUser = await this.userRepo.findOne({
        where: { email: userData.email },
      });

      if (!existingUser) {
        const user = this.userRepo.create(userData);
        await this.userRepo.save(user);
      }
    }

    console.log(`✅ Users seeding completed`);
  }

  private async seedBlogs() {
    console.log('📝 Seeding blogs...');

    const users = await this.userRepo.find();

    const blogs = [
      {
        title: 'Getting Started with NestJS: A Complete Guide',
        body: `NestJS is a progressive Node.js framework for building efficient and scalable server-side applications. It uses TypeScript by default and combines elements of OOP, FP, and FRP.`,
        authorId: users[1].id,
        isPublic: true,
      },
      {
        title: 'Top 10 Hidden Gems in Southeast Asia',
        body: `Southeast Asia is full of incredible destinations that remain off the beaten path. Here are my top 10 hidden gems that will take your breath away.`,
        authorId: users[2].id,
        isPublic: true,
      },
      {
        title: 'The Art of Perfect Pasta: Authentic Italian Recipes',
        body: `Pasta is more than just food in Italy - it's a way of life. After spending months in Italy learning from local chefs, I'm sharing authentic recipes.`,
        authorId: users[3].id,
        isPublic: true,
      },
      {
        title: '5 Morning Habits That Will Transform Your Life',
        body: `Your morning routine sets the tone for your entire day. These 5 science-backed habits have helped thousands of my clients achieve their goals.`,
        authorId: users[4].id,
        isPublic: true,
      },
    ];

    for (const blogData of blogs) {
      const existingBlog = await this.blogRepo.findOne({
        where: { title: blogData.title },
      });

      if (!existingBlog) {
        const blog = this.blogRepo.create(blogData);
        await this.blogRepo.save(blog);
      }
    }

    console.log(`✅ Blogs seeding completed`);
  }

  private async seedComments() {
    console.log('💬 Seeding comments...');

    const commentCount = await this.commentRepo.count();
    if (commentCount > 0) {
      console.log('💬 Comments already exist, skipping...');
      return;
    }

    const users = await this.userRepo.find();
    const blogs = await this.blogRepo.find({ where: { isPublic: true } });

    const comments = [
      {
        body: 'Great article! Really helped me understand NestJS better.',
        blogId: blogs[0].id,
        authorId: users[2].id,
      },
      {
        body: 'Thanks for sharing this. Very useful information.',
        blogId: blogs[0].id,
        authorId: users[3].id,
      },
      {
        body: 'Amazing places! Adding them to my travel list.',
        blogId: blogs[1].id,
        authorId: users[0].id,
      },
    ];

    for (const commentData of comments) {
      const comment = this.commentRepo.create(commentData);
      await this.commentRepo.save(comment);
    }

    console.log(`✅ Comments seeding completed`);
  }

  private async seedLikes() {
    console.log('❤️ Seeding likes...');

    const likeCount = await this.likeRepo.count();
    if (likeCount > 0) {
      console.log('❤️ Likes already exist, skipping...');
      return;
    }

    const users = await this.userRepo.find();
    const blogs = await this.blogRepo.find({ where: { isPublic: true } });

    const likes = [
      { userId: users[0].id, blogId: blogs[0].id },
      { userId: users[1].id, blogId: blogs[1].id },
      { userId: users[2].id, blogId: blogs[0].id },
    ];

    for (const likeData of likes) {
      const like = this.likeRepo.create(likeData);
      await this.likeRepo.save(like);
    }

    console.log(`✅ Likes seeding completed`);
  }

  private async seedFollows() {
    console.log('👥 Seeding follows...');

    const followCount = await this.followRepo.count();
    if (followCount > 0) {
      console.log('👥 Follows already exist, skipping...');
      return;
    }

    const users = await this.userRepo.find();

    const follows = [
      { followerId: users[0].id, followingId: users[1].id },
      { followerId: users[1].id, followingId: users[2].id },
      { followerId: users[2].id, followingId: users[3].id },
    ];

    for (const followData of follows) {
      const follow = this.followRepo.create(followData);
      await this.followRepo.save(follow);
    }

    console.log(`✅ Follows seeding completed`);
  }
}
