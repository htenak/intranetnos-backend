import {
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Request,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthAndRoles } from 'src/common/decorators';
import { ROLE } from 'src/config/constants';

import { ClassService } from 'src/class/class.service';
import { ScheduleService } from 'src/schedule/schedule.service';
import { ProfessorService } from './professor.service';

@ApiTags('Professor routes')
@Controller('professor')
export class ProfessorController {
  constructor(
    private readonly classService: ClassService,
    private readonly scheduleService: ScheduleService,
    private readonly professorService: ProfessorService,
  ) {}

  // obtiene carreras
  @AuthAndRoles(ROLE.professor)
  @Get('careers')
  async getCareers() {
    const data = await this.professorService.getCareers();
    return { statusCode: HttpStatus.OK, data };
  }

  // obtiene carreras
  @AuthAndRoles(ROLE.professor)
  @Get('cycles')
  async getCycles() {
    const data = await this.professorService.getCycles();
    return { statusCode: HttpStatus.OK, data };
  }

  // obtiene profesores
  @AuthAndRoles(ROLE.professor)
  @Get('colleagues')
  async getProfessors(@Request() req: any) {
    const data = await this.professorService.getColleagues(req.user.role);
    return { statusCode: HttpStatus.OK, data };
  }

  // obtiene clases del profesor
  @AuthAndRoles(ROLE.professor)
  @Get('classes')
  async getClassesProfessor(@Request() req: any) {
    const data = await this.classService.getClassesProfessor(req.user.sub);
    return { statusCode: HttpStatus.OK, data };
  }

  @AuthAndRoles(ROLE.professor)
  @Get('other-classes/:params')
  async getOtherClassesProfessor(
    @Param('params', ParseArrayPipe) params: number[],
  ) {
    const data = await this.classService.getAllClassesAndFilters(params);
    return { statusCode: HttpStatus.OK, data };
  }

  @AuthAndRoles(ROLE.professor)
  @Get('schedules-by-class/:id')
  async getSchedulesByClassId(@Param('id', ParseIntPipe) classId: number) {
    const data = await this.scheduleService.getSchedulesByClassId(classId);
    return { statusCode: HttpStatus.OK, data };
  }
}
