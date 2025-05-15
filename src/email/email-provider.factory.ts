import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailProvider } from './interfaces/email-provider.interface';
import { MailtrapProvider } from './providers/mailtrap.provider';
import { BrevoProvider } from './providers/brevo.provider';
import { SendgridProvider } from './providers/sendgrid.provider';

@Injectable()
export class EmailProviderFactory {
  constructor(
    private configService: ConfigService,
    private mailtrapProvider: MailtrapProvider,
    private brevoProvider: BrevoProvider,
    private sendgridProvider: SendgridProvider,
  ) {}

  createProvider(): EmailProvider {
    const environment =
      this.configService.get<string>('NODE_ENV') || 'development';

    switch (environment) {
      case 'development':
        return this.mailtrapProvider;
      case 'staging':
        return this.sendgridProvider;
      case 'production':
        return this.brevoProvider;
      default:
        return this.mailtrapProvider;
    }
  }
}
