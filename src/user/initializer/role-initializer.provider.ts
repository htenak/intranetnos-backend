import { Provider } from '@nestjs/common';
import { UserService } from '../user.service';

/**
 * Provider que se inserta en 'providers'
 * en user.module para arrancar creando
 * los roles y el primer administrador en la
 * base de datos
 */

export const RoleInitializerProvider: Provider = {
  provide: 'ROLE_INITIALIZER',
  useFactory: async (userService: UserService) => {
    await userService.createRolesIfNotExist();
    await userService.createAdminIfNotExist();
  },
  inject: [UserService],
};
