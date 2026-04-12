import {
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';

// OTP
export const InvalidOTPException = new UnprocessableEntityException([
  {
    message: 'Error.InvalidOTP',
    path: 'code',
  },
]);

export const ExpiredOTPException = new UnprocessableEntityException([
  {
    message: 'Error.ExpiredOTP',
    path: 'code',
  },
]);

export const FailedToSentOTPException = new UnprocessableEntityException([
  {
    message: 'Error.FailedToSentOTP',
    path: 'email',
  },
]);

// Tokens
export const RefreshTokenRevokedException = new UnauthorizedException([
  {
    message: 'Error.RefreshTokenRevoked',
    path: 'Refresh token has been revoked',
  },
]);

// Email
export const EmailAlreadyExistException = new UnprocessableEntityException([
  {
    message: 'Error.EmailAlreadyExist',
    path: 'email',
  },
]);

export const EmailNotFoundException = new UnprocessableEntityException([
  {
    message: 'Error.EmailNotFound',
    path: 'email',
  },
]);

// Password
export const IncorrectPasswordException = new UnprocessableEntityException([
  {
    message: 'Error.IncorrectPassword',
    path: 'password',
  },
]);

// Google
export const GoogleAuthenticationFailedException = new UnauthorizedException([
  {
    message: 'Error.GoogleAuthenticationFailed',
    path: 'google',
  },
]);

export const GoogleUserInfoError = new UnauthorizedException([
  {
    message: 'Error.GoogleUserInfoError',
    path: 'google',
  },
]);

// 2FA
export const TOTPAlreadyEnabledException = new UnprocessableEntityException([
  {
    message: 'Error.TOTPAlreadyEnabled',
    path: 'totpCode',
  },
]);

export const TOTPNotEnabledException = new UnprocessableEntityException([
  {
    message: 'Error.TOTPNotEnabled',
    path: 'totpCode',
  },
]);

export const InvalidTOTPException = new UnprocessableEntityException([
  {
    message: 'Error.InvalidTOTP',
    path: 'totpCode',
  },
]);

export const InvalidTOTPAndCodeException = new UnprocessableEntityException([
  {
    message: 'Error.InvalidTOTPAndCode',
    path: 'totpCode',
  },
  {
    message: 'Error.InvalidTOTPAndCode',
    path: 'code',
  },
]);
