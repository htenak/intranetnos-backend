import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateClassroomDto {
  @IsNumber({}, { message: 'El número del aula debe ser de tipo númerico' })
  @Min(1, { message: 'El número del aula debe ser mayor o igual a 1' })
  number: number;

  @IsString({ message: 'La descripción debe ser texto' })
  @IsOptional()
  description?: string;
}
