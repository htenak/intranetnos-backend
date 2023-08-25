import {
  ForbiddenException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
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
      if (!user) throw new NotFoundException('El usuario no existe');
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
      const checkPass = compare(dto.password, userFound.password);
      if (!(await checkPass)) throw new ForbiddenException('Clave incorrecta');

      // eliminamos password de la respuesta:
      delete userFound.password;

      // creamos payload para el token:
      const payload = {
        sub: userFound.id,
        username: userFound.username,
        role: userFound.role.name,
      };
      const token = this.jwtService.sign(payload);
      return { data: userFound, token };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }
}
