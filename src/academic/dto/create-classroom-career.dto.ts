import { IsNumber, IsString, Min, MinLength } from 'class-validator';
export class CreateClassroomCareerDto {
  @IsNumber({}, { message: 'El identificador del aula debe ser un número' })
  @Min(1, { message: 'El identificador del aula debe ser mayor a cero' })
  classroomId: number;

  @IsNumber(
    {},
    { message: 'El identificador de la carrera debe ser un número' },
  )
  @Min(1, { message: 'El identificador de la carrera es inválido' })
  careerId: number;
}
