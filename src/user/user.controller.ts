import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateUserDto, UpdateUserDto } from './dto';
import { AuthAndRoles } from 'src/common/decorators';
import { ROLE } from 'src/config/constants';

@ApiBearerAuth()
@ApiTags('User routes')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // obtener usuarios por status | ?status=true | false | *
  @AuthAndRoles()
  @Get()
  async getUsersByStatus(@Query('status') status: string) {
    const data = await this.userService.getUsersByStatus(status);
    return { data };
  }

  // obtener roles
  @AuthAndRoles(ROLE.admin)
  @Get('roles')
  async getRoles() {
    const data = await this.userService.getRoles();
    return { data };
  }

  // obtener usuarios por roleId
  @AuthAndRoles(ROLE.admin)
  @Get('role/:id')
  async getUsersByRoleId(@Param('id', ParseIntPipe) roleId: number) {
    const data = await this.userService.getUsersByRoleId(roleId);
    return { data };
  }

  // obtener usuario por id
  @AuthAndRoles(ROLE.user, ROLE.student, ROLE.professor, ROLE.admin)
  @Get(':id')
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    const data = await this.userService.getUserById(id);
    return { data };
  }

  // crear usuario
  @AuthAndRoles(ROLE.admin)
  @Post()
  async createUser(@Body() dto: CreateUserDto) {
    const data = await this.userService.createUser(dto);
    return { message: 'Se registró exitosamente', data };
  }

  // actualizar usuario
  @Put(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ) {
    const data = await this.userService.updateUser(id, dto);
    return { message: 'Se actualizó exitosamente', data };
  }

  // eliminar usuario
  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    const data = await this.userService.deleteUser(id);
    return { message: 'Se eliminó el usuario', data };
  }
}
