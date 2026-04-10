import { Injectable } from '@nestjs/common';
import * as OTPAuth from 'otpauth';

@Injectable()
export class TwoFactorService {
  private createTOTP(email: string) {
    return new OTPAuth.TOTP({
      issuer: 'ACME',
      label: email,
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
    });
  }

  generateTOTPSecret(email: string) {
    const totp = this.createTOTP(email);
    return {
      secret: totp.secret.base32,
      uri: totp.toString(),
    };
  }

  verifyTOTP({ email, token }: { email: string; token: string }): boolean {
    const totp = this.createTOTP(email);
    const delta = totp.validate({ token, window: 1 });
    return delta !== null;
  }
}
