import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailTemplateService {
  getOtpTemplate(otp: string | number): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
        <h2 style="color: #333; text-align: center;">Email Verification</h2>
        <p>Thank you for registering with our blog platform. Please use the following code to verify your email address:</p>
        <div style="background-color: #f8f8f8; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
          ${otp}
        </div>
        <p>If you didn't request this code, please ignore this email.</p>
      </div>
    `;
  }
}
