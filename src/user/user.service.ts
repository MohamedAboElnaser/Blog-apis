import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDTO } from 'src/auth/dto/register-dto';
import { User } from './entities/user.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { HashingService } from 'src/auth/hashing.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private readonly hashService: HashingService,
  ) {}
  async add(data: RegisterDTO) {
    try {
      data.password = await this.hashService.hash(data.password);
      const userInstance = this.usersRepository.create(data);
      const user = await this.usersRepository.save(userInstance);
      const { password, ...result } = user;
      return result;
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new ConflictException('Email already used');
      }
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }
}
