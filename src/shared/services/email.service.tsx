import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import envConfig from '../config';
import { LinearLoginCodeEmail } from 'emails/verification-code.email';

@Injectable()
export class EmailService {
  constructor(private resend: Resend) {
    this.resend = new Resend(envConfig.RESEND_API_KEY);
  }

  async sendOTP(payload: { email: string; code: string }) {
    return await this.resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'khoinguyenbenz@gmail.com',
      subject: 'Your verification code',
      react: <LinearLoginCodeEmail validationCode={payload.code} />,
    });
  }
}
