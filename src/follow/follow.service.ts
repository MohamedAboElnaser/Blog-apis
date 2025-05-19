import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follow } from './entities/follow.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(Follow) private followRepo: Repository<Follow>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async follow(followerId: number, followingId: number) {
    if (followerId === followingId) {
      throw new BadRequestException("You can't follow yourself.");
    }

    const existingFollow = await this.followRepo.findOneBy({
      followerId,
      followingId,
    });
    if (existingFollow) {
      throw new BadRequestException('You are already following this user.');
    }
    //Make sure that user exist
    const following = await this.userRepo.findOne({
      where: { id: followingId },
    });
    if (!following)
      throw new NotFoundException(`No user exist with id: ${followingId}`);

    const follow = this.followRepo.create({ followerId, followingId });
    await this.followRepo.save(follow);

    return following.firstName;
  }

  async unfollow(followerId: number, followingId: number) {
    const result = await this.followRepo.delete({ followerId, followingId });
    if (result.affected === 0) {
      throw new NotFoundException(
        `You do not follow any user with id: ${followingId}`,
      );
    }
  }

  async getFollowers(userId: number, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [follows, total] = await this.followRepo.findAndCount({
      where: { followingId: userId },
      relations: ['follower'],
      skip,
      take: limit,
      select: {
        follower: {
          id: true,
          firstName: true,
          photo_url: true,
        },
      },
    });

    const followers = follows.map((follow) => ({
      id: follow.follower.id,
      firstName: follow.follower.firstName,
      photo_url: follow.follower.photo_url,
    }));

    return {
      followers,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
