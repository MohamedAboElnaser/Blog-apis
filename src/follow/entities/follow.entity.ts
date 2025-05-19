import { User } from 'src/user/entities/user.entity';
import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('followers')
export class Follow {
  @PrimaryColumn()
  followerId: number;

  @PrimaryColumn()
  followingId: number;

  @ManyToOne(() => User, (user) => user.following, { onDelete: 'CASCADE' })
  follower: User;

  @ManyToOne(() => User, (user) => user.followers, { onDelete: 'CASCADE' })
  following: User;
}
