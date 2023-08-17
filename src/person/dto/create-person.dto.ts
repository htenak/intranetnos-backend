import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class CreatePersonDto {
  @IsString({ message: 'El nombre debe ser una cadena' })
  name: string;

  @IsString({ message: 'El primer apellido debe ser una cadena' })
  lastName1: string;

  @IsString({ message: 'El segundo apellido debe ser una cadena' })
  lastName2: string;

  @IsString({ message: 'El primer apellido debe ser una cadena' })
  @MinLength(8, { message: 'El dni debe tener 8 caracteres' })
  @MaxLength(8, { message: 'El dni debe tener 8 caracteres' })
  dni: string;

  @IsEmail({}, { message: 'El correo debe ser válido' })
  email: string;

  @IsString({ message: 'El celular debe ser una cadena' })
  @MinLength(9, { message: 'El celular debe tener 9 caracteres' })
  @MaxLength(9, { message: 'El celular debe tener 9 caracteres' })
  phone: string;
}
