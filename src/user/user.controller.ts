import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Request,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response } from 'express';

import { UserService } from './user.service';
import { CreateUserDto, UpdateMyUserDto, UpdateUserDto } from './dto';
import { AuthAndRoles } from 'src/common/decorators';
import { ROLE } from 'src/config/constants';
import { fileFilter, renameImage } from './helper';
import { join } from 'path';

@ApiBearerAuth()
@ApiTags('User routes')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * RUTAS ADMIN:
   */

  // obtener roles
  @AuthAndRoles(ROLE.admin)
  @Get('roles')
  async getRoles() {
    const data = await this.userService.getRoles();
    return { statusCode: HttpStatus.OK, data };
  }

  // obtener user por status
  @Get('users')
  @AuthAndRoles(ROLE.admin, ROLE.student)
  async getUsersByStatus(@Query('status') status: string) {
    const data = await this.userService.getUsersByStatus(status);
    return { statusCode: HttpStatus.OK, data };
  }

  // obtener usuarios por rol
  @AuthAndRoles(ROLE.admin)
  @Get('role/:id')
  async getUsersByRoleId(@Param('id', ParseIntPipe) roleId: number) {
    const data = await this.userService.getUsersByRoleId(roleId);
    return { statusCode: HttpStatus.OK, data };
  }

  // obtener usuario por id
  @AuthAndRoles(ROLE.admin)
  @Get('profile/:id')
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    const data = await this.userService.getUserById(id);
    return { statusCode: HttpStatus.OK, data };
  }

  // crear usuario
  @AuthAndRoles(ROLE.admin)
  @Post('create')
  async createUser(@Body() dto: CreateUserDto) {
    const data = await this.userService.createUser(dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Se registró exitosamente',
      data,
    };
  }

  // actualizar usuario
  @AuthAndRoles(ROLE.admin)
  @Put('update/:id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ) {
    const data = await this.userService.updateUser(id, dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Se actualizó exitosamente',
      data,
    };
  }

  // eliminar usuario
  @AuthAndRoles(ROLE.admin)
  @Delete('delete/:id')
  async deleteUser(@Request() req: any, @Param('id', ParseIntPipe) id: number) {
    const data = await this.userService.deleteUser(req.user.sub, id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Se eliminó el usuario',
      data,
    };
  }

  /**
   * RUTAS PROFESSOR:
   */

  //obtener estudiante
  @AuthAndRoles(ROLE.professor)
  @Get('student/:id')
  async getStudent(@Param('id', ParseIntPipe) idStudent: number) {
    const data = await this.userService.getStudent(idStudent, ROLE.student);
    return { statusCode: HttpStatus.OK, data };
  }

  /**
   * RUTAS PROPIAS:
   */

  // obtener mi perfil
  @AuthAndRoles(ROLE.admin, ROLE.professor, ROLE.student)
  @Get('my-profile/data')
  async getMyData(@Request() req: any) {
    const data = await this.userService.getUserById(req.user.sub);
    return { statusCode: HttpStatus.OK, data };
  }

  // actualizar mi perfil
  @AuthAndRoles(ROLE.admin, ROLE.professor, ROLE.student)
  @Put('my-profile/update')
  async updateMyData(@Request() req: any, @Body() dto: UpdateMyUserDto) {
    const data = await this.userService.updateMyData(req.user.sub, dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Se actualizó tu perfil',
      data,
    };
  }

  // subir o actualizar mi foto de perfil
  @AuthAndRoles(ROLE.admin, ROLE.professor, ROLE.student)
  @Put('my-profile/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: renameImage,
      }),
      fileFilter: fileFilter,
    }),
  )
  async uploadPhoto(
    @Request() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const data = await this.userService.uploadPhoto(req.user.sub, file);
    return {
      statusCode: HttpStatus.OK,
      message: 'Se subió tu foto de perfil',
      data: data.filename,
    };
  }

  // obtener mi foto
  @AuthAndRoles(ROLE.admin, ROLE.professor, ROLE.student)
  @Get('my-profile/photo')
  async getMyPhoto(@Request() req: any, @Res() res: Response) {
    const fileName = await this.userService.getMyPhotoName(req.user.sub);
    const filePath = join(__dirname, '..', '..', 'uploads', fileName);
    return res.sendFile(filePath);
  }
}
