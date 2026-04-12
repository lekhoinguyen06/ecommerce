import { createZodDto } from 'nestjs-zod';
import {
  Disable2FABodySchema,
  ForgotPasswordBodySchema,
  GetAuthURLResSchema,
  LoginBodySchema,
  LoginResSchema,
  LogoutBodySchema,
  RefreshTokenBodySchema,
  RefreshTokenResSchema,
  RegisterBodySchema,
  RegisterResSchema,
  SendOTPBodySchema,
  TwoFASetupResSchema,
} from './auth.model';

export class RegisterBodyDTO extends createZodDto(RegisterBodySchema) {}
export class RegisterResDTO extends createZodDto(RegisterResSchema) {}

export class SendOTPBodyDTO extends createZodDto(SendOTPBodySchema) {}

export class LoginBodyDTO extends createZodDto(LoginBodySchema) {}
export class LoginResDTO extends createZodDto(LoginResSchema) {}

export class RefreshTokenBodyDTO extends createZodDto(RefreshTokenBodySchema) {}
export class RefreshTokenResDTO extends createZodDto(RefreshTokenResSchema) {}

export class LogoutBodyDTO extends createZodDto(LogoutBodySchema) {}

export class ForgotPasswordBodyDTO extends createZodDto(
  ForgotPasswordBodySchema,
) {}

export class GetAuthURLResDTO extends createZodDto(GetAuthURLResSchema) {}

export class TwoFASetupResDTO extends createZodDto(TwoFASetupResSchema) {}

export class Disable2FABodyDTO extends createZodDto(Disable2FABodySchema) {}
