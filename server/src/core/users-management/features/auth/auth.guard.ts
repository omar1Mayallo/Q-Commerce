import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '../../common/modules/jwt/jwt.service';
import { UserService } from '../user/user.service';
import { SetMetadata } from '@nestjs/common';

/**
 * Decorator to restrict access to route handlers based on user roles.
 *
 * The `AllowedTo` decorator sets metadata specifying the roles that are allowed to access a route.
 * This is used with a guard to enforce role-based access control.
 *
 * @param {...string[]} roles - The roles permitted to access the route.
 *
 * @example
 * @AllowedTo('ADMIN')
 * @AllowedTo('ADMIN', 'MANAGER')
 *
 */
export const AllowedTo = (...roles: string[]) => SetMetadata('roles', roles);

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Authentication token is missing or invalid',
      );
    }

    const token = authHeader.split(' ')[1];

    let decodedToken;
    try {
      decodedToken = await this.jwtService.verifyToken(token);
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const user = await this.userService.getUser(decodedToken.id);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    request.user = user;

    if (roles && !roles.includes(user.role)) {
      throw new ForbiddenException('Access denied');
    }

    return true;
  }
}
