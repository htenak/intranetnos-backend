import {
  ForbiddenException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

import { User } from 'src/user/entities';
import { Repository } from 'typeorm';
import { LoginAuthDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  //   obtiene usuario por username
  async getUserByUsername(username: string) {
    try {
      /*
       * Se usa queryBuilder porque password es {select: false} en su entidad
       */
      const user = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.role', 'role')
        .where({ username })
        .addSelect('user.password')
        .getOne();
      if (!user) throw new NotFoundException('Usuario incorrecto');
      return user;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // hacer login
  async login(dto: LoginAuthDto) {
    try {
      const userFound = await this.getUserByUsername(dto.username);

      // validamos el estado del usuario
      if (userFound) {
        if (userFound.status === false) {
          throw new ForbiddenException('Tu cuenta está inhabilitada');
        }
      }
      const checkPass = compare(dto.password, userFound.password);
      if (!(await checkPass)) throw new ForbiddenException('Clave incorrecta');

      // eliminamos password de la respuesta:
      delete userFound.password;

      // creamos payload para el token:
      const payload = {
        sub: userFound.id,
        username: userFound.username,
        role: userFound.role.name,
        filename: userFound.filename,
      };
      const token = this.jwtService.sign(payload);
      return { data: userFound, token };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // renueva el token
  async renewToken(token: string) {
    try {
      // verificar y decodificar el token existente
      const decodedToken = this.jwtService.verify(token);
      if (!decodedToken) {
        throw new UnauthorizedException(
          'Token inválido o expirado, actualiza la página',
        );
      }

      // obtener informacion del usuario basada en el token
      const userFound = await this.getUserByUsername(decodedToken.username);

      // eliminamos la password de la respuesta
      delete userFound.password;

      // crear un nuevo payload con la información del usuario
      const payload = {
        sub: userFound.id,
        username: userFound.username,
        role: userFound.role.name,
        filename: userFound.filename,
      };

      // generar un nuevo token
      const newToken = this.jwtService.sign(payload);

      // devolver el nuevo token
      return { data: userFound, token: newToken };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new UnauthorizedException('No se pudo renovar el token.');
    }
  }
}
