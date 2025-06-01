import { User } from 'src/user/entities/user.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('blogs')
export class Blog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  authorId: number;

  @Column()
  title: string;

  @Column()
  body: string;

  @Column({ default: true })
  isPublic: boolean;

  @ManyToOne(() => User, (user) => user.blogs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'authorId' })
  author: User;

  @OneToMany(() => Comment, (comment) => comment.blog, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  comments: Comment[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
