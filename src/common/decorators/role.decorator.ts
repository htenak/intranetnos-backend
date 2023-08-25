import { SetMetadata } from '@nestjs/common';

// agrega a la metadata 'roles'
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
