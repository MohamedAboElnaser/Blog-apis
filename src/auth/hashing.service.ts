import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class HashingService {
  constructor(private readonly configService: ConfigService) {}

  async hash(textToBeHashed: string): Promise<string> {
    return await bcrypt.hash(
      textToBeHashed,
      this.configService.get<string>('SALT'),
    );
  }

  async compare(plainText: string, hashedText: string): Promise<boolean> {
    return await bcrypt.compare(plainText, hashedText);
  }
}
