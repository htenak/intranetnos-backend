import { IsNotEmpty } from 'class-validator';

export class LoginAuthDto {
  @IsNotEmpty({ message: 'El usuario es obligatorio' })
  username: string;

  @IsNotEmpty({ message: 'La clave es obligatoria' })
  password: string;
}
