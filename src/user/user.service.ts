import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDTO } from 'src/auth/dto/register-dto';
import { User } from './entities/user.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { HashingService } from 'src/auth/hashing.service';
import { OtpService } from 'src/otp/otp.service';
import { Otp } from 'src/otp/entities/otp.entity';
import { UpdateUserDto } from './update.user.dto';
import { BlogService } from 'src/blog/blog.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Otp) private otpRepository: Repository<Otp>,
    private readonly hashService: HashingService,
    private otpService: OtpService,
    private blogService: BlogService,
  ) {}
  async add(data: RegisterDTO) {
    try {
      data.password = await this.hashService.hash(data.password);
      const userInstance = this.usersRepository.create(data);
      const user = await this.usersRepository.save(userInstance);
      const { password, ...result } = user;

      const otp = this.otpService.generateOtp(6);

      //create otp record
      await this.otpRepository.save({ code: otp, email: data.email });

      //TODO delete this line after implementing email service
      console.log(`Generated otp for ${user.email} : ${otp}`);

      // TODO send the otp via email to the client
      return result;
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new ConflictException('Email already used');
      }
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  async delete(userId: number) {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not exist');

    const result = await this.usersRepository.delete(userId);
    if (result.affected === 0)
      throw new InternalServerErrorException('Failed to delete user');
  }

  async update(id: number, data: UpdateUserDto) {
    //Check if the user record exist
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found!');

    Object.assign(user, data);
    const record = await this.usersRepository.save(user);
    const { password, ...updatedUser } = record;
    return updatedUser;
  }

  async getPublicBlogs(userId: number) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException(`No user exist with id: ${userId}`);
    return this.blogService.getUserPublicBlogs(userId);
  }
}
