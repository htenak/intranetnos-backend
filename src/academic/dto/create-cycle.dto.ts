import { IsDateString, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCycleDto {
  @IsString({ message: 'La abreviación debe ser texto' })
  @MinLength(1, { message: 'La abreviación debe tener al menos 1 caracter' })
  @MaxLength(3, {
    message: 'La abreviación solo puede tener hasta 3 caracteres',
  })
  abbreviation: string;

  @IsString({ message: 'La descripción debe ser texto' })
  @MinLength(1, { message: 'La descripción debe tener al menos un caracter' })
  description: string;

  @IsDateString({}, { message: 'La fecha de inicio es inválida' })
  startDate: Date;

  @IsDateString({}, { message: 'La fecha de fin es inválida' })
  endDate: Date;
}
