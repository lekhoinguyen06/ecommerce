import { Exclude } from 'class-transformer';
import { IsString } from 'class-validator';

export class LoginBodyDTO {
  // Should provide uuid for token uniqueness
  @IsString()
  email: string;
  @IsString()
  password: string;
}

export class RegisterBodyDTO extends LoginBodyDTO {
  @IsString()
  name: string;
  @IsString()
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
