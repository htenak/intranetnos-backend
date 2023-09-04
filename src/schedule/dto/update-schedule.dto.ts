import { PartialType } from '@nestjs/mapped-types';
import { CreateScheduleDto } from './create-schedule.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateScheduleDto extends PartialType(CreateScheduleDto) {
  @IsBoolean({ message: 'El estado del horario debe ser booleando' })
  @IsOptional()
  status?: boolean;
}
