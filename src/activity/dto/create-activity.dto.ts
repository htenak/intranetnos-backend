import {
  IsDateString,
  IsNumber,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class CreateActivityDto {
  @IsString({ message: 'El nombre de la actividad debe ser texto' })
  @MinLength(1, {
    message: 'El nombre de la actividad debe tener al menos un caracter',
  })
  name: string;

  @IsString({ message: 'La descripción de la actividad debe ser texto' })
  @MinLength(1, {
    message: 'La descripción de la actividad debe tener al menos un caracter',
  })
  description: string;

  @IsNumber({}, { message: 'La nota mínima debe ser un número' })
  @Min(0, { message: 'La nota mínima no debe ser menor que 0' })
  minGrade: number;

  @IsNumber({}, { message: 'La nota máxima debe ser un número' })
  @Max(20, { message: 'La nota máxima no debe pasar de 20' })
  maxGrade: number;

  @IsDateString({}, { message: 'La fecha de vencimiento debe ser válida' })
  dueDate: Date;

  @IsNumber(
    {},
    { message: 'El identificador del tipo de actividad debe ser número' },
  )
  @Min(1, { message: 'El identificador del tipo de actividad es inválido' })
  activityTypeId: number;

  @IsNumber({}, { message: 'El identificador de la clase debe ser número' })
  @Min(1, { message: 'El identificador de la clase es inválido' })
  classId: number;
}
