import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { OtpEmailService } from './otp-email.service';
import { BrevoProvider } from './providers/brevo.provider';
import { MailtrapProvider } from './providers/mailtrap.provider';
import { EmailProviderFactory } from './email-provider.factory';
import { EmailTemplateService } from './email-template.service';
import { SendgridProvider } from './providers/sendgrid.provider';

@Module({
  providers: [
    EmailService,
    OtpEmailService,
    BrevoProvider,
    MailtrapProvider,
    SendgridProvider,
    EmailProviderFactory,
    EmailTemplateService,
  ],
  exports: [OtpEmailService],
})
export class EmailModule {}
