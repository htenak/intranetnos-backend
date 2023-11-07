import {
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Request,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ClassService } from 'src/class/class.service';

import { AuthAndRoles } from 'src/common/decorators';
import { ROLE } from 'src/config/constants';
import { ScheduleService } from 'src/schedule/schedule.service';

@ApiTags('Professor routes')
@Controller('professor')
export class ProfessorController {
  constructor(
    private readonly classService: ClassService,
    private readonly scheduleService: ScheduleService,
  ) {}

  // obtiene clases del profesor
  @AuthAndRoles(ROLE.professor)
  @Get('classes')
  async getClassesProfessor(@Request() req: any) {
    const data = await this.classService.getClassesProfessor(req.user.sub);
    return { statusCode: HttpStatus.OK, data };
  }

  @AuthAndRoles(ROLE.professor)
  @Get('other-classes')
  async getOtherClassesProfessor(@Request() req: any) {
    const data = await this.classService.getOtherClassesProfessores();
    return { statusCode: HttpStatus.OK, data };
  }

  @AuthAndRoles(ROLE.professor)
  @Get('schedules-by-class/:id')
  async getSchedulesByClassId(@Param('id', ParseIntPipe) classId: number) {
    const data = await this.scheduleService.getSchedulesByClassId(classId);
    return { statusCode: HttpStatus.OK, data };
  }
}
