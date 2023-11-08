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
import { ApiTags } from '@nestjs/swagger';
import { AcademicService } from './academic.service';
import { AuthAndRoles } from 'src/common/decorators';
import { ROLE } from 'src/config/constants';
import {
  CreateCareerDto,
  CreateClassroomDto,
  CreateCourseDto,
  CreateCourseTypeDto,
  CreateCycleDto,
  UpdateCareerDto,
  UpdateClassroomDto,
  UpdateCourseDto,
  UpdateCourseTypeDto,
  UpdateCycleDto,
} from './dto';

@ApiTags('Academic routes')
@Controller('academic')
export class AcademicController {
  constructor(private readonly academicService: AcademicService) {}

  /**
   * RUTAS CARRERAS:
   */

  // obtiene carreras
  @AuthAndRoles(ROLE.admin)
  @Get('careers')
  async getCareers() {
    const data = await this.academicService.getCareers();
    return { statusCode: HttpStatus.OK, data };
  }

  // obtiene carrera
  @AuthAndRoles(ROLE.admin)
  @Get('careers/:id')
  async getCareer(@Param('id', ParseIntPipe) id: number) {
    const data = await this.academicService.getCareerById(id);
    return { statusCode: HttpStatus.OK, data };
  }

  // crea carrera
  @AuthAndRoles(ROLE.admin)
  @Post('careers/')
  async createCareer(@Body() dto: CreateCareerDto) {
    const data = await this.academicService.createCareer(dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Se registró exitosamente',
      data,
    };
  }

  // actualiza carrera
  @AuthAndRoles(ROLE.admin)
  @Put('careers/:id')
  async updateCareer(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCareerDto,
  ) {
    const data = await this.academicService.updateCareer(id, dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Se actualizó correctamente',
      data,
    };
  }

  @AuthAndRoles(ROLE.admin)
  @Delete('careers/:id')
  async deleteCareer(@Param('id', ParseIntPipe) id: number) {
    const data = await this.academicService.deleteCareer(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Se eliminó el registro',
      data,
    };
  }

  /**
   * RUTAS AULAS:
   */

  // obtiene carreras
  @AuthAndRoles(ROLE.admin)
  @Get('classrooms')
  async getClassrooms() {
    const data = await this.academicService.getClassrooms();
    return { statusCode: HttpStatus.OK, data };
  }

  // obtiene carrera
  @AuthAndRoles(ROLE.admin)
  @Get('classrooms/:id')
  async getClassroom(@Param('id', ParseIntPipe) id: number) {
    const data = await this.academicService.getClassroomById(id);
    return { statusCode: HttpStatus.OK, data };
  }

  // crea carrera
  @AuthAndRoles(ROLE.admin)
  @Post('classrooms/')
  async createClassroom(@Body() dto: CreateClassroomDto) {
    const data = await this.academicService.createClassroom(dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Se registró exitosamente',
      data,
    };
  }

  // actualiza carrera
  @AuthAndRoles(ROLE.admin)
  @Put('classrooms/:id')
  async updateClassroom(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateClassroomDto,
  ) {
    const data = await this.academicService.updateClassroom(id, dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Se actualizó correctamente',
      data,
    };
  }

  @AuthAndRoles(ROLE.admin)
  @Delete('classrooms/:id')
  async deleteClassroom(@Param('id', ParseIntPipe) id: number) {
    const data = await this.academicService.deleteClassroom(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Se eliminó el registro',
      data,
    };
  }

  /**
   * RUTAS CICLOS:
   */

  // obtiene ciclos
  @AuthAndRoles(ROLE.admin)
  @Get('cycles')
  async getCycles() {
    const data = await this.academicService.getCycles();
    return { statusCode: HttpStatus.OK, data };
  }

  // obtiene ciclo
  @AuthAndRoles(ROLE.admin)
  @Get('cycles/:id')
  async getCycle(@Param('id', ParseIntPipe) id: number) {
    const data = await this.academicService.getCycleById(id);
    return { statusCode: HttpStatus.OK, data };
  }

  // crea ciclo
  @AuthAndRoles(ROLE.admin)
  @Post('cycles/')
  async createCycle(@Body() dto: CreateCycleDto) {
    const data = await this.academicService.createCycle(dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Se registró correctamente',
      data,
    };
  }

  // actualiza ciclo
  @AuthAndRoles(ROLE.admin)
  @Put('cycles/:id')
  async updateCycle(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCycleDto,
  ) {
    const data = await this.academicService.updateCycle(id, dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Se actualizó correctamente',
      data,
    };
  }

  // elimina ciclo
  @AuthAndRoles(ROLE.admin)
  @Delete('cycles/:id')
  async deleteCycle(@Param('id', ParseIntPipe) id: number) {
    const data = await this.academicService.deleteCycle(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Se eliminó el registro',
      data,
    };
  }

  /**
   * RUTAS TIPOS DE CURSO:
   */

  // obtiene tipos de curso
  @AuthAndRoles(ROLE.admin)
  @Get('course-types')
  async getCourseTypes() {
    const data = await this.academicService.getCourseTypes();
    return { statusCode: HttpStatus.OK, data };
  }

  // obtiene tipo de curso
  @AuthAndRoles(ROLE.admin)
  @Get('course-types/:id')
  async getCourseType(@Param('id', ParseIntPipe) id: number) {
    const data = await this.academicService.getCourseTypeById(id);
    return { statusCode: HttpStatus.OK, data };
  }

  // crea tipo de curso
  @AuthAndRoles(ROLE.admin)
  @Post('course-types/')
  async createCourseType(@Body() dto: CreateCourseTypeDto) {
    const data = await this.academicService.createCourseType(dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Se registró correctamente',
      data,
    };
  }

  // actualiza tipo de curso
  @AuthAndRoles(ROLE.admin)
  @Put('course-types/:id')
  async updateCourseType(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCourseTypeDto,
  ) {
    const data = await this.academicService.updateCourseType(id, dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Se actualizó correctamente',
      data,
    };
  }

  // elimina tipo de curso
  @AuthAndRoles(ROLE.admin)
  @Delete('course-types/:id')
  async deleteCourseType(@Param('id', ParseIntPipe) id: number) {
    const data = await this.academicService.deleteCourseType(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Se eliminó el registro',
      data,
    };
  }

  /**
   * RUTAS CURSOS:
   */

  // obtiene cursos
  @AuthAndRoles(ROLE.admin)
  @Get('courses')
  async getCourses() {
    const data = await this.academicService.getCourses();
    return { statusCode: HttpStatus.OK, data };
  }

  // obtiene cursos por cycleId
  @AuthAndRoles(ROLE.admin)
  @Get('courses/cycleId/:id')
  async getCoursesByCycleId(@Param('id', ParseIntPipe) cycleId: number) {
    const data = await this.academicService.getCoursesByCycleId(cycleId);
    return { statusCode: HttpStatus.OK, data };
  }

  // obtiene curso
  @AuthAndRoles(ROLE.admin)
  @Get('courses/:id')
  async getCourse(@Param('id', ParseIntPipe) id: number) {
    const data = await this.academicService.getCourseById(id);
    return { statusCode: HttpStatus.OK, data };
  }

  // crea curso
  @AuthAndRoles(ROLE.admin)
  @Post('courses')
  async createCourse(@Body() dto: CreateCourseDto) {
    const data = await this.academicService.createCourse(dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Se registró correctamente',
      data,
    };
  }

  // actualiza curso
  @AuthAndRoles(ROLE.admin)
  @Put('courses/:id')
  async updateCourse(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCourseDto,
  ) {
    const data = await this.academicService.updateCourse(id, dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Se actualizó correctamente',
      data,
    };
  }

  // cambia estado de curso
  @AuthAndRoles(ROLE.admin)
  @Put('courses/status/:id')
  async updateStatusCourse(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: { status: boolean },
  ) {
    const data = await this.academicService.updateStatusCourse(id, dto.status);
    return {
      statusCode: HttpStatus.OK,
      message: 'Se actualizó correctamente',
      data,
    };
  }

  // elimina curso
  @AuthAndRoles(ROLE.admin)
  @Delete('courses/:id')
  async deleteCourse(@Param('id', ParseIntPipe) id: number) {
    const data = await this.academicService.deleteCourse(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Se eliminó el registro',
      data,
    };
  }

  /**
   * PROFESORES Y ESTUDIANTES:
   */

  // obtiene profesores
  @AuthAndRoles(ROLE.admin)
  @Get('professors')
  async getProfessors() {
    const data = await this.academicService.getProfessors();
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  // obtiene profesor
  @AuthAndRoles(ROLE.admin)
  @Get('professors/:id')
  async getProfessor(@Param('id', ParseIntPipe) id: number) {
    const data = await this.academicService.getProfessorById(id);
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  // obtiene estudiantes
  @AuthAndRoles(ROLE.admin)
  @Get('students')
  async getStudents() {
    const data = await this.academicService.getStudents();
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  // obtiene estudiante
  @AuthAndRoles(ROLE.admin)
  @Get('students/:id')
  async getStudent(@Param('id', ParseIntPipe) id: number) {
    const data = await this.academicService.getStudentById(id);
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  // obtiene totales (libre)
  @Get('totals')
  async getTotalsAcademic() {
    const data = await this.academicService.getTotalsAcademic();
    return { statusCode: HttpStatus.OK, data };
  }
}
