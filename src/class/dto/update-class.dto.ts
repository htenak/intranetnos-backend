import { PartialType } from '@nestjs/mapped-types';
import { CreateClassDto } from './create-class.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateClassDto extends PartialType(CreateClassDto) {
  @IsBoolean({ message: 'El estado de la clase debe ser booleano' })
  @IsOptional()
  status?: boolean;
}
