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
} from '@nestjs/common';
import { ClassService } from './class.service';
import { ApiTags } from '@nestjs/swagger';
import {
  CreateClassDto,
  CreateStudentClassDto,
  UpdateStudentClassDto,
} from './dto';
import { AuthAndRoles } from 'src/common/decorators';
import { ROLE } from 'src/config/constants';
import { UpdateClassDto } from './dto/update-class.dto';

@ApiTags('Class routes')
@Controller('class')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  /**
   * RUTAS CLASES:
   */

  // obtiene clases
  @AuthAndRoles(ROLE.admin)
  @Get('classes')
  async getClasses() {
    const data = await this.classService.getClasses();
    return { statusCode: HttpStatus.OK, data };
  }
  // obtiene clase
  @AuthAndRoles(ROLE.admin)
  @Get('classes/:id')
  async getClass(@Param('id', ParseIntPipe) id: number) {
    const data = await this.classService.getClassById(id);
    return { statusCode: HttpStatus.OK, data };
  }

  // crea clase
  @AuthAndRoles(ROLE.admin)
  @Post('classes')
  async createClass(@Body() dto: CreateClassDto) {
    const data = await this.classService.createClass(dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Se registró la clase',
      data,
    };
  }

  // actualiza clase
  @AuthAndRoles(ROLE.admin)
  @Put('classes/:id')
  async updateClass(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateClassDto,
  ) {
    const data = await this.classService.updateClass(id, dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Se actualizó la clase',
      data,
    };
  }

  // elimina clase
  @AuthAndRoles(ROLE.admin)
  @Delete('classes/:id')
  async deleteClass(@Param('id', ParseIntPipe) id: number) {
    const data = await this.classService.deleteClass(id);
    return { statusCode: HttpStatus.OK, message: 'Se eliminó la clase', data };
  }

  /**
   * RUTAS ESTUDIANTES CLASES:
   */

  // obtiene clases estudiantes
  @AuthAndRoles(ROLE.admin)
  @Get('student-classes')
  async getStudentClasses() {
    const data = await this.classService.getStudentClasses();
    return { statusCode: HttpStatus.OK, data };
  }

  // obtiene clase estudiante
  @AuthAndRoles(ROLE.admin)
  @Get('student-classes/:id')
  async getStudentClass(@Param('id', ParseIntPipe) id: number) {
    const data = await this.classService.getStudentClassById(id);
    return { statusCode: HttpStatus.OK, data };
  }

  // crea clase estudiante
  @AuthAndRoles(ROLE.admin)
  @Post('student-classes')
  async createStudentClass(@Body() dto: CreateStudentClassDto) {
    const data = await this.classService.createStudentClass(dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Se registró la clase del estudiante',
      data,
    };
  }

  // actualiza clase estudiante
  @AuthAndRoles(ROLE.admin)
  @Put('student-classes/:id')
  async updateStudentClass(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStudentClassDto,
  ) {
    const data = await this.classService.updateStudentClass(id, dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Se actualizó la clase del estudiante',
      data,
    };
  }

  // elimina clase estudiante
  @AuthAndRoles(ROLE.admin)
  @Delete('student-classes/:id')
  async deleteStudentClass(@Param('id', ParseIntPipe) id: number) {
    const data = await this.classService.deleteStudentClass(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Se eliminó la clase del estudiante',
      data,
    };
  }
}
