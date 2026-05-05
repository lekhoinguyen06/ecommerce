import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';
import { TokenService } from '../services/token.service';
import { REQUEST_USER_KEY } from '../constants/auth.constant';
import { AccessTokenPayload } from 'src/types/jwt.type';
import { PrismaService } from '../services/prisma.service';
import { HTTPMethodType } from '../constants/permission.constant';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly prismaService: PrismaService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    // Extract and validate the access token
    const decodedAccessToken =
      await this.extractAndValidateAccessToken(request);

    // Validate user permissions
    await this.validateUserPermissions(decodedAccessToken, request);

    return true;
  }

  private async extractAndValidateAccessToken(
    request: Request,
  ): Promise<AccessTokenPayload> {
    const accessToken = this.extractTokenFromHeader(request);
    try {
      const decodedAccessToken =
        await this.tokenService.verifyAccessToken(accessToken);
      request[REQUEST_USER_KEY] = decodedAccessToken;
      return decodedAccessToken;
    } catch {
      throw new UnauthorizedException('Error.InvalidAccessToken');
    }
  }

  private extractTokenFromHeader(request: Request): string {
    const accessToken = request.headers.authorization?.split(' ')[1];
    if (!accessToken)
      throw new UnauthorizedException('Error.MissingAccessToken');
    return accessToken;
  }

  private async validateUserPermissions(
    user: AccessTokenPayload,
    request: Request,
  ): Promise<void> {
    const roleId = user.roleId;
    const path = request.route.path;
    const method = request.method;
    const role = await this.prismaService.role
      .findUniqueOrThrow({
        where: { id: roleId },
        include: {
          permissions: {
            where: {
              permission: {
                path,
                method: method as HTTPMethodType,
                deletedAt: null,
              },
            },
            include: {
              permission: true,
            },
          },
        },
      })
      .catch(() => {
        throw new ForbiddenException();
      });
    if (role.permissions.length === 0) {
      throw new ForbiddenException();
    }
  }
}
