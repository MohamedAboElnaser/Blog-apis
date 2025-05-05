import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginDTO } from './dto/login-dto';
import { VerifyEmailDTO } from './dto/verify-email-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Otp } from 'src/otp/entities/otp.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Otp) private otpsRepository: Repository<Otp>,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}
  async verify(data: VerifyEmailDTO) {
    let user: User = null;
    let otpRecord: Otp = null;

    otpRecord = await this.otpsRepository.findOne({
      where: { email: data.email, code: data.otp },
    });
    /**
     * 3 possibilities:
     * email exist but verified
     * email exist but otp is wrong
     * email not exist
     */
    if (!otpRecord) {
      //Fetch user record
      user = await this.usersRepository.findOne({
        where: { email: data.email },
      });

      if (user?.isVerified) {
        throw new BadRequestException(`${user.email} is already Verified`);
      } else {
        throw new BadRequestException(`Something wrong with Email or Opt`);
      }
    }

    //Fetch user record
    user = await this.usersRepository.findOne({
      where: { email: data.email },
    });

    //Update isVerified field
    user.isVerified = true;
    await this.usersRepository.save(user);
    //Delete otp record
    await this.otpsRepository.delete({ email: data.email });
  }

  login(data: LoginDTO) {
    return 'jwt Generated';
  }
}
