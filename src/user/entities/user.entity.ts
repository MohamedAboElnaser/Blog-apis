import { Blog } from 'src/blog/entities/blog.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  firstName: string;

  @Column()
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

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
