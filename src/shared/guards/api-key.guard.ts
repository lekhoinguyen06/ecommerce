import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { TokenService } from '../services/token.service';
import envConfig from '../config';

@Injectable()
export class APIKeyGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const xAPIKey = request.headers['x-api-key'];
    if (!xAPIKey)
      throw new UnauthorizedException(
        'Missing header. No x-api-key was provided',
      );
    if (xAPIKey !== envConfig.SECRET_API_KEY)
      throw new UnauthorizedException('Invalid API key');
    return true;
  }
}
