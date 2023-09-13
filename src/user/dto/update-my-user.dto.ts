import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateMyUserDto {
  @IsEmail({}, { message: 'El correo no es válido' })
  @IsOptional()
  email?: string;

  @IsString({ message: 'El celular debe ser una cadena de texto' })
  @IsOptional()
  @MinLength(9, { message: 'El celular debe tener 9 números' })
  @MaxLength(9, { message: 'El celular debe tener 9 números' })
  phone?: string;

  @IsString({ message: 'El apodo debe ser una cadena de texto' })
  @IsOptional()
  @MinLength(3, { message: 'El apodo debe tener al menos 3 caracteres' })
  nickname?: string;

  @IsString({ message: 'La clave debe ser una cadena de caracteres' })
  @IsOptional()
  @MinLength(4, { message: 'La clave debe tener al menos 4 caracteres' })
  password?: string;
}
