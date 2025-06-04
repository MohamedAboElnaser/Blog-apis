import { Blog } from 'src/blog/entities/blog.entity';
import { Follow } from 'src/follow/entities/follow.entity';
import { Like } from 'src/like/entities/like.entity';

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  firstName: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: '' })
  photo_url: string;

  @Column({ default: false })
  isVerified?: boolean;

  @OneToMany(() => Blog, (blog) => blog.author, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  blogs: Blog[];

  comments: Comment[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => Follow, (follow) => follow.follower)
  following: Follow[];

  @OneToMany(() => Follow, (follow) => follow.following)
  followers: Follow[];

  @OneToMany(() => Like, (like) => like.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  likes: Like[];
}
