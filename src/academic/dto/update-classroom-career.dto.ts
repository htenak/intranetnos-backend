import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateClassroomCareerDto } from './create-classroom-career.dto';

export class UpdateClassroomCareerDto extends PartialType(
  CreateClassroomCareerDto,
) {
  @IsBoolean({ message: 'El estado debe ser un valor booleano' })
  @IsOptional()
  status?: boolean;
}
