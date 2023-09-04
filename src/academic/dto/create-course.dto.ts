import {
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateCourseDto {
  @IsString({ message: 'El nombre del curso debe ser texto' })
  name: string;

  @IsString({ message: 'La abreviación debe ser texto' })
  @MinLength(1, { message: 'La abreviación debe tener al menos 1 caracter' })
  abbreviation: string;

  @IsNumber({}, { message: 'El tipo de curso debe ser un numero' })
  @Min(1, { message: 'El tipo de curso no es válido' })
  courseTypeId: number;

  @IsNumber()
  @IsOptional()
  careerId?: number;
}
