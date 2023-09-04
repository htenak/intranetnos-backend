import { PartialType } from '@nestjs/mapped-types';
import { CreateCycleDto } from './create-cycle.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateCycleDto extends PartialType(CreateCycleDto) {
  @IsBoolean({ message: 'El estado debe ser booleano' })
  @IsOptional()
  status?: boolean;
}
