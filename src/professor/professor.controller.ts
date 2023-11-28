import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Put,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthAndRoles } from 'src/common/decorators';
import { ROLE } from 'src/config/constants';

import { ClassService } from 'src/class/class.service';
import { ScheduleService } from 'src/schedule/schedule.service';
import { ProfessorService } from './professor.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileFilter, renameImage } from 'src/common/helpers';

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

  // sube foto de portada de la clase
  @AuthAndRoles(ROLE.professor)
  @Put('upload-photo-class/:id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/classes-photos',
        filename: renameImage,
      }),
      fileFilter: fileFilter,
    }),
  )
  async uploadCoverPhotoClass(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const data = await this.classService.uploadCoverPhotoClass(id, file);
    return {
      statusCode: HttpStatus.OK,
      message: 'Se subió la foto de la clase',
      data,
    };
  }

  // elimina foto de portada de la clase
  @AuthAndRoles(ROLE.professor)
  @Delete('delete-photo-class/:id')
  async deleteCoverPhotoClass(@Param('id', ParseIntPipe) id: number) {
    const data = await this.classService.deleteCoverPhotoClass(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Se eliminó la foto de la clase',
      data: data,
    };
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
