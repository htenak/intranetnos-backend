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
  Request,
} from '@nestjs/common';
import { ActivityService } from './activity.service';
import { AuthAndRoles } from 'src/common/decorators';
import { ApiTags } from '@nestjs/swagger';
import { ROLE } from 'src/config/constants';
import { CreateActivityTypeDto, UpdateActivityTypeDto } from './dto';

@ApiTags('Activities routes')
@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  /**
   * RUTAS TIPOS DE ACTIVIDAD:
   */

  // obtiene todos los tipos de actividad
  @AuthAndRoles(ROLE.admin)
  @Get('admin/activities-type')
  async getActivityTypes() {
    const data = await this.activityService.getActivityTypes();
    return { statusCode: HttpStatus.OK, data };
  }

  // obtiene tipo de actividades propias del profesor
  @AuthAndRoles(ROLE.professor)
  @Get('professor/activities-type')
  async getActivityTypesProfessor(@Request() req: any) {
    const data = await this.activityService.getActivityTypesProfessor(
      req.user.sub,
    );
    return { statusCode: HttpStatus.OK, data };
  }

  // obtiene tipo de actividad del propio profesor
  @AuthAndRoles(ROLE.professor)
  @Get('professor/activities-type/:id')
  async getActivityTypeProfessorById(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const data = await this.activityService.getActivityTypeProfessorById(
      req.user.sub,
      id,
    );
    return { statusCode: HttpStatus.OK, data };
  }

  // crea tipo de actividad para el propio profesor
  @AuthAndRoles(ROLE.professor)
  @Post('professor/activities-type')
  async createActivityTypeProfessor(
    @Request() req: any,
    @Body() dto: CreateActivityTypeDto,
  ) {
    const data = await this.activityService.createAtivityTypeProfessor(
      req.user.sub,
      dto,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Se registró el tipo de actividad',
      data,
    };
  }

  // actualiza tipo de actividad del propio profesor
  @AuthAndRoles(ROLE.professor)
  @Put('professor/activities-type/:id')
  async updateActivityTypeProfessor(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateActivityTypeDto,
  ) {
    const data = await this.activityService.updateActivityTypeProfessor(
      req.user.sub,
      id,
      dto,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Se actualizó el tipo de actividad',
      data,
    };
  }

  // elimina el tipo de actividad del propio profesor
  @AuthAndRoles(ROLE.professor)
  @Delete('professor/activities-type/:id')
  async deleteActivityTypeProfessor(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const data = await this.activityService.deleteActivityTypeProfessor(
      req.user.sub,
      id,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Se eliminó el tipo de actividad',
      data,
    };
  }

  /**
   * RUTAS ACTIVIDADES:
   */
}
