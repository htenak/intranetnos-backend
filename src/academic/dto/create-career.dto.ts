import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateCareerDto {
  @IsString({ message: 'El nombre debe ser texto' })
  @MinLength(1, { message: 'El nombre debe tener al menos un caracter' })
  name: string;

  @IsString({ message: 'La descripción debe ser texto' })
  @IsOptional()
  description?: string;
}
