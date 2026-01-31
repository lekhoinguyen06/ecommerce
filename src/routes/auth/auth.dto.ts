import { Exclude } from 'class-transformer';
import { IsString, Length } from 'class-validator';
import { Match } from 'src/shared/decorators/custom-validator.decorator';

export class LoginBodyDTO {
  // Should provide uuid for token uniqueness
  @IsString()
  email: string;
  @IsString()
  @Length(8, 20, { message: 'Password must be between 8 to 20 charactors' })
  password: string;
}

export class RegisterBodyDTO extends LoginBodyDTO {
  @IsString()
  name: string;
  @IsString()
  @Match('password', { message: 'Password must match' })
  confirmPassword: string;
}

export class RegisterResDTO {
  constructor(partial: Partial<RegisterResDTO>) {
    Object.assign(this, partial);
  }

  id: number;
  email: string;
  name: string;
  @Exclude() password: string;
  createdAt: Date;
  updatedAt: Date;
}

export class LoginResDTO {
  constructor(partial: Partial<LoginResDTO>) {
    Object.assign(this, partial);
  }

  accessToken: string;
  refreshToken: string;
}

export class RefreshTokenBodyDTO {
  @IsString()
  refreshToken: string;
}

export class RefreshTokenResDTO extends LoginResDTO {}
