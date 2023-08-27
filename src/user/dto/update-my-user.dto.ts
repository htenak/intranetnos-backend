import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateMyUserDto {
  @IsEmail({}, { message: 'El correo no es válido' })
  @IsOptional()
  email?: string;

  @IsString({ message: 'El apodo debe ser una cadena de texto' })
  @IsOptional()
  @MinLength(3)
  nickname?: string;

  @IsString({ message: 'La clave debe ser una cadena de caracteres' })
  @IsOptional()
  @MinLength(4, { message: 'La clave debe tener al menos 4 caracteres' })
  password?: string;
}
