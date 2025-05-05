import { Injectable } from '@nestjs/common';

@Injectable()
export class OtpService {
  generateOtp(digits: number): number {
    if (digits <= 0) {
      throw new Error('Number of digits must be greater than zero');
    }
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
