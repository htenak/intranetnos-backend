import { IsString } from 'class-validator';

export class CreateActivityTypeDto {
  @IsString({ message: 'El nombre de la actividad debe ser texto' })
  name: string;

  @IsString({ message: 'La descripción de la actividad debe ser texto' })
  description: string;
}
