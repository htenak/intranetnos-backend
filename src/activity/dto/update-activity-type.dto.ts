import { PartialType } from '@nestjs/mapped-types';
import { CreateActivityTypeDto } from './create-activity-type.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateActivityTypeDto extends PartialType(CreateActivityTypeDto) {
  @IsOptional()
  @IsBoolean({ message: 'El estado del tipo de la actividad debe ser boleano' })
  status?: boolean;
}
