import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { EmailProvider } from '../interfaces/email-provider.interface';
import { EmailOptions } from '../interfaces/email-options.interface';

@Injectable()
export class MailtrapProvider implements EmailProvider {
  private transporter;
  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAILTRAP_HOST'),
      port: this.configService.get<number>('MAILTRAP_PORT'),
      secure: false,
      auth: {
        user: this.configService.get<string>('MAILTRAP_USER'),
        pass: this.configService.get<string>('MAILTRAP_PASS'),
      },
    });
  }

  async sendMail(options: EmailOptions): Promise<boolean> {
    await this.transporter.sendMail({
      from: options.from || this.configService.get<string>('EMAIL_FROM'),
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    return true;
  }
}
