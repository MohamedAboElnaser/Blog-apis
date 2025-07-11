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
import { OtpEmailService } from 'src/email/otp-email.service';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Otp) private otpsRepository: Repository<Otp>,
    @InjectRepository(User) private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private hashingService: HashingService,
    private otpService: OtpService,
    private emailService: OtpEmailService,
    private config: ConfigService,
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
    //generate token and refresh-token
    return await this.generateTokens(user.email, user.id);
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
    await this.otpsRepository.upsert(
      { email: data.email, code: otp },
      { conflictPaths: ['email'] },
    );

    //TODO Delete this log statement in production and un comment sending email
    console.log(`otp generated: ${otp}`);
    await this.emailService.sendOtpEmail(data.email, otp);
    return otp;
  }

  async requestResetPassword(email: string) {
    //Make sure user exist
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException(`${email} is not registered`);

    //Generate otp
    const otp = this.otpService.generateOtp(6);

    //Save otp at db
    await this.otpsRepository.upsert(
      { email, code: otp },
      { conflictPaths: ['email'] },
    );

    //Send Email with otp to user
    //TODO Uncomment this line in Staging and production environment
    await this.emailService.sendPasswordResetEmail(email, otp);

    // Only log OTP in development environment
    if (process.env.NODE_ENV === 'development') {
      console.log(`OTP for ${email}: ${otp}`);
    }
  }

  async resetPassword(code: number, email: string, newPassword: string) {
    //Validate the otp code
    const otpRecord = await this.otpsRepository.findOne({
      where: { code, email },
    });
    if (!otpRecord)
      throw new NotFoundException(
        `Make sure that you request Reset password code, or issue one first`,
      );

    //Hash and save the new password
    const password = await this.hashingService.hash(newPassword);
    await this.usersRepository.update({ email }, { password });

    //Delete optRecord
    await this.otpsRepository.delete({ email });
  }

  async generateTokens(userEmail: string, userId: string | number) {
    const payload = { email: userEmail, sub: userId };
    const access_token = await this.jwtService.signAsync(payload);
    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: this.config.get<string>('REFRESH_JWT_SECRET'),
      expiresIn: this.config.get<string | number>('REFRESH_JWT_EXPIRES_IN'),
    });
    return {
      access_token,
      refresh_token,
    };
  }

  async extractAndVerifyCookie(
    cookie: string,
  ): Promise<{ email: string; sub: string }> {
    try {
      const payload = this.jwtService.verify(cookie, {
        secret: this.config.get<string>('REFRESH_JWT_SECRET'),
      });
      return payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async refreshToken(req: Request) {
    const cookie = req.cookies['refresh_token'];
    if (!cookie) {
      throw new UnauthorizedException('No refresh token provided');
    }

    const { email, sub } = await this.extractAndVerifyCookie(cookie);

    // Generate new tokens
    const { access_token, refresh_token } = await this.generateTokens(
      email,
      sub,
    );
    return { access_token, refresh_token };
  }
}
