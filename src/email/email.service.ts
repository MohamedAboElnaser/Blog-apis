import { Injectable, Logger } from '@nestjs/common';
import { EmailOptions } from './interfaces/email-options.interface';
import { EmailProvider } from './interfaces/email-provider.interface';
import { EmailProviderFactory } from './email-provider.factory';

@Injectable()
export class EmailService {
  private provider: EmailProvider;
  private readonly logger = new Logger(EmailService.name);

  constructor(private emailProviderFactory: EmailProviderFactory) {
    this.provider = this.emailProviderFactory.createProvider();
    this.logger.log(
      `Using ${this.provider.constructor.name} as email provider`,
    );
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      await this.provider.sendMail(options);
      this.logger.log(`Email sent to ${options.to}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send email to ${options.to}`, error);
      throw error;
    }
  }
}
