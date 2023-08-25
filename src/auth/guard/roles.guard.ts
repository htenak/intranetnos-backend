import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    // if (!requiredRoles) {
    //   return true; // si no se usa roles se permite el acceso
    // }
    const request = context.switchToHttp().getRequest();
    const userRole = request.user.role; // obtiene role desde el token

    if (!requiredRoles.includes(userRole)) {
      throw new ForbiddenException('No tienes permiso a este recurso');
    }

    return requiredRoles.includes(userRole);
  }
}
