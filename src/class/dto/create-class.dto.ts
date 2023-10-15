import { IsNumber, IsString, Min } from 'class-validator';

export class CreateClassDto {
  @IsNumber({}, { message: 'El identificador del ciclo debe ser número' })
  @Min(1, { message: 'El numero identificador del ciclo es inválido' })
  cycleId: number;

  @IsNumber({}, { message: 'El identificador de la carrera debe ser número' })
  @Min(1, { message: 'El numero identificador de la carrera es inválido' })
  careerId: number;

  @IsNumber({}, { message: 'El identificador del curso debe ser número' })
  @Min(1, { message: 'El numero identificador del curso es inválido' })
  courseId: number;

  @IsNumber({}, { message: 'El identificador del profesor debe ser número' })
  @Min(1, { message: 'El numero identificador del profesor es inválido' })
  professorUserId: number;

  @IsString({ message: 'La denominación debe ser una cadena de texto' })
  denomination: string;
}
