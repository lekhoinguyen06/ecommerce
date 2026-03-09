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

export const EmailDoesNotExistException = new UnprocessableEntityException([
  {
    message: 'Error.EmailDoesNotExist',
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
  },
]);
