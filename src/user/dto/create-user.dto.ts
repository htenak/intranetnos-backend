import {
  IsBoolean,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'El nombre debe ser una cadena' })
  name: string;

  @IsString({ message: 'El apellido paterno debe ser una cadena texto' })
  @MinLength(1, {
    message: 'El apellido paterno debe tener al menos un caracter',
  })
  lastName1: string;

  @IsString({ message: 'El apellido materno debe ser una cadena texto' })
  @MinLength(1, {
    message: 'El apellido materno debe tener al menos un caracter',
  })
  lastName2: string;

  @IsString({ message: 'El DNI debe ser una cadena de texto' })
  @MinLength(8, { message: 'El DNI debe tener 8 números' })
  @MaxLength(8, { message: 'El DNI debe tener 8 números' })
  dni: string;

  @IsEmail({}, { message: 'El correo no es válido' })
  @IsOptional()
  email?: string;

  @IsString({ message: 'El celular debe ser una cadena de texto' })
  @MinLength(9, { message: 'El celular debe tener 9 números' })
  @MaxLength(9, { message: 'El celular debe tener 9 números' })
  phone: string;

  @IsNumber({}, { message: 'El identificador de rol debe ser un número' })
  @Min(1, { message: 'El rol debe ser válido' })
  roleId: number;

  /**
   * solo se usa al actualizar usuario
   * cuando cambia email
   * */
  @IsOptional()
  nickname?: string;

  /**
   * solo se usa al actualizar usuario
   * cuando cambia DNI
   * */
  @IsOptional()
  username?: string;
  @IsOptional()
  password?: string;

  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
