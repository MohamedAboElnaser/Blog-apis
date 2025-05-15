import { Injectable } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailTemplateService } from './email-template.service';
import { EmailOptions } from './interfaces/email-options.interface';

@Injectable()
export class OtpEmailService {
  constructor(
    private emailService: EmailService,
    private templateService: EmailTemplateService,
  ) {}

  async sendOtpEmail(to: string, otp: number): Promise<boolean> {
    const options: EmailOptions = {
      to,
      subject: 'Your Blog Account Verification Code',
      html: this.templateService.getOtpTemplate(otp),
    };

    return await this.emailService.sendEmail(options);
  }
}
