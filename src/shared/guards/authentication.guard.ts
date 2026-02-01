import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import {
  AUTH_TYPE_KEY,
  AuthTypeDecoratorPayload,
} from '../decorators/auth.decorator';
import { AuthType, GuardCondition } from '../constants/auth.constant';
import { Reflector } from '@nestjs/core';
import { APIKeyGuard } from './api-key.guard';
import { AccessTokenGuard } from './access-token.guard';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private readonly authTypeMap: Record<string, CanActivate>;
  constructor(
    private readonly reflector: Reflector,
    private readonly APIKeyGuard: APIKeyGuard,
    private readonly accessTokenGuard: AccessTokenGuard,
  ) {
    this.authTypeMap = {
      [AuthType.APIKey]: this.APIKeyGuard,
      [AuthType.Bearer]: this.accessTokenGuard,
      [AuthType.None]: { canActivate: () => true },
    };
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authTypeValue = this.reflector.getAllAndOverride<
      AuthTypeDecoratorPayload | undefined
    >(AUTH_TYPE_KEY, [context.getHandler(), context.getClass()]) ?? {
      authTypes: [AuthType.None],
      options: { condition: GuardCondition.Or },
    };

    const guards = authTypeValue.authTypes.map(
      (authType: string) => this.authTypeMap[authType],
    );

    if (authTypeValue.options.condition === GuardCondition.Or) {
      for (const guard of guards) {
        const canActivate = await guard.canActivate(context);
        if (canActivate) return true;
      }
      throw new UnauthorizedException('a');
    }

    if (authTypeValue.options.condition === GuardCondition.And) {
      for (const guard of guards) {
        const canActivate = await guard.canActivate(context);
        if (!canActivate) throw new UnauthorizedException('b');
      }
      return true;
    }

    throw new UnauthorizedException('c');
  }
}
