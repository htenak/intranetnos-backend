import { PartialType } from '@nestjs/mapped-types';
import { CreateCourseDto } from './create-course.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateCourseDto extends PartialType(CreateCourseDto) {
  @IsBoolean({ message: 'El estado debe ser un valor booleano' })
  @IsOptional()
  status?: boolean;
}
