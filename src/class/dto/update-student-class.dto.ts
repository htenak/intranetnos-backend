import { PartialType } from '@nestjs/mapped-types';
import { CreateStudentClassDto } from './create-student-class.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateStudentClassDto extends PartialType(CreateStudentClassDto) {
  @IsBoolean({
    message: 'El estado de la clase del estudiante debe ser un booleano',
  })
  @IsOptional()
  status?: boolean;
}
