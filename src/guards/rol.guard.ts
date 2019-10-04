import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const rol = this.reflector.get<string>('rol', context.getHandler());
    if (!rol) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const hasRoleAdmin = () => user.rol.match(/admin/);
    return user && user.rol && hasRoleAdmin();
  }
}
