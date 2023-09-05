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
import { ScheduleService } from './schedule.service';
import { AuthAndRoles } from 'src/common/decorators';
import { ROLE } from 'src/config/constants';
import { ApiTags } from '@nestjs/swagger';
import { CreateScheduleDto, UpdateScheduleDto } from './dto';

@ApiTags('Schedule routes')
@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  // obtiene dias
  @AuthAndRoles(ROLE.admin)
  @Get('days')
  async getDays() {
    const data = await this.scheduleService.getDays();
    return { statusCode: HttpStatus.OK, data };
  }

  // obtiene dia
  @AuthAndRoles(ROLE.admin)
  @Get('days/:id')
  async getDay(@Param('id', ParseIntPipe) id: number) {
    const data = await this.scheduleService.getDayById(id);
    return { statusCode: HttpStatus.OK, data };
  }

  // obtiene horarios
  @AuthAndRoles(ROLE.admin)
  @Get('schedules')
  async getSchedules() {
    const data = await this.scheduleService.getSchedules();
    return { statusCode: HttpStatus.OK, data };
  }

  // obtiene horario
  @AuthAndRoles(ROLE.admin)
  @Get('schedules/:id')
  async getSchedule(@Param('id', ParseIntPipe) id: number) {
    const data = await this.scheduleService.getScheduleById(id);
    return { statusCode: HttpStatus.OK, data };
  }

  // crea horario
  @AuthAndRoles(ROLE.admin)
  @Post('schedules')
  async createSchedule(@Body() dto: CreateScheduleDto) {
    const data = await this.scheduleService.createSchedule(dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Se registró el horarió',
      data,
    };
  }

  // actualiza horario
  @AuthAndRoles(ROLE.admin)
  @Put('schedules/:id')
  async updateSchedule(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateScheduleDto,
  ) {
    const data = await this.scheduleService.updateSchedule(id, dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Se actualizó el horarió',
      data,
    };
  }

  // elimina horario
  @AuthAndRoles(ROLE.admin)
  @Delete('schedules/:id')
  async deleteSchedule(@Param('id', ParseIntPipe) id: number) {
    const data = await this.scheduleService.deleteSchedule(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Se eliminó el horario',
      data,
    };
  }
}
