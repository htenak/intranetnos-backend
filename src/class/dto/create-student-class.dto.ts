import { IsNumber, Min } from 'class-validator';

export class CreateStudentClassDto {
  @IsNumber({}, { message: 'El idetificador de la clase debe ser un número ' })
  @Min(1, { message: 'El identificador de la clase es iválido' })
  classId: number;

  @IsNumber(
    {},
    { message: 'El idetificador del estudiante debe ser un número' },
  )
  @Min(1, { message: 'El identificador del estudiante es inválido' })
  studentUserId: number;
}
