import { IsNumber, IsString, Min } from 'class-validator';

export class CreateScheduleDto {
  @IsString({ message: 'La hora de inicio debe ser una cadena de texto' })
  startTime: string;

  @IsString({ message: 'La hora de fin debe ser una cadena de texto' })
  endTime: string;

  @IsNumber({}, { message: 'El identificador del día debe ser un número' })
  @Min(1, { message: 'El identificador del día es inválido' })
  dayId: number;

  @IsNumber({}, { message: 'El identificador de la clase debe ser un número' })
  @Min(1, { message: 'El identificador de la clase es inválido' })
  classId: number;
}
