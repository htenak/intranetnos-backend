import { UseGuards, applyDecorators } from '@nestjs/common';

import { Roles } from './role.decorator';
import { JwtAuthGuard } from 'src/auth/guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';

export function AuthAndRoles(...roles: string[]) {
  return applyDecorators(
    UseGuards(JwtAuthGuard), // autenticación jwt
    UseGuards(RolesGuard), // guardian de roles
    Roles(...roles), // usa los roles proporcionados
  );
}
