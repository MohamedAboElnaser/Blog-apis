import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDTO } from './dto/login-dto';
import { VerifyEmailDTO } from './dto/verify-email-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Otp } from 'src/otp/entities/otp.entity';
import { User } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { HashingService } from './hashing.service';
import { ResendCodeDto } from './dto/resend-otp';
import { OtpService } from 'src/otp/otp.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Otp) private otpsRepository: Repository<Otp>,
    @InjectRepository(User) private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private hashingService: HashingService,
    private otpService: OtpService,
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
        throw new BadRequestException(
          `Something wrong, Either the Email is not registered or the otp is wrong`,
        );
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

  async login(data: LoginDTO) {
    /**
     * First fetch the user record and validate that email exist and verified
     * */
    const user = await this.usersRepository.findOne({
      where: {
        email: data.email,
      },
      select: {
        id: true,
        password: true,
        isVerified: true,
      },
    });

    if (!user) throw new NotFoundException('The email is not registered!');

    if (!user.isVerified)
      throw new BadRequestException(
        'Please verify your email before logging in.',
      );

    if (!(await this.hashingService.compare(data.password, user.password)))
      throw new UnauthorizedException('Wrong password!');

    //Happy Scenario
    const payload = { sub: user.id, email: data.email };
    return await this.jwtService.signAsync(payload);
  }

  async resendVerificationCode(data: ResendCodeDto) {
    //Check if the the email already exist
    const user = await this.usersRepository.findOne({
      where: { email: data.email },
    });

    if (!user) throw new NotFoundException(`${data.email} is not registered!`);

    if (user.isVerified)
      throw new BadRequestException('Email already verified, You can login');

    const otp = this.otpService.generateOtp(6);

    //Add otp record or update the code if already exist
    const otpRecord = await this.otpsRepository.upsert(
      { email: data.email, code: otp },
      { conflictPaths: ['email'] },
    );
    console.log(`otp record: ${otpRecord}`);
    //TODO //Send the otp via email to the user
    return otp;
  }
}
