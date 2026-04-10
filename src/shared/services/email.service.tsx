import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import envConfig from '../config';
import { LinearLoginCodeEmail } from 'root/emails/verification-code.email';

@Injectable()
export class EmailService {
  constructor(private resend: Resend) {
    this.resend = new Resend(envConfig.RESEND_API_KEY);
  }

  sendOTP(payload: { email: string; code: string }) {
    return this.resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'khoinguyenbenz@gmail.com',
      subject: 'Your verification code',
      react: <LinearLoginCodeEmail validationCode={payload.code} />,
    });
  }
}
