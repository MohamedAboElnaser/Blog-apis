import { EmailOptions } from './email-options.interface';

export interface EmailProvider {
  sendMail(options: EmailOptions): Promise<boolean>;
}
