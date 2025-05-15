import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { EmailProvider } from '../interfaces/email-provider.interface';
import { EmailOptions } from '../interfaces/email-options.interface';

@Injectable()
export class BrevoProvider implements EmailProvider {
  private transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('BREVO_HOST'),
      port: this.configService.get<number>('BREVO_PORT'),
      auth: {
        user: this.configService.get<string>('BREVO_USER'),
        pass: this.configService.get<string>('BREVO_KEY'),
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
