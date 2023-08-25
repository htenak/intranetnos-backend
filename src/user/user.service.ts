import {
  BadRequestException,
  ConflictException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role, User } from './entities';
import { hash } from 'bcryptjs';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {}

  // crea los roles si no existen
  async createRolesIfNotExist() {
    try {
      const roles = [
        { name: 'admin' },
        { name: 'professor' },
        { name: 'student' },
        { name: 'user' },
      ];
      for (const roleData of roles) {
        const existRole = await this.roleRepository.findOne({
          where: { name: roleData.name },
        });
        if (!existRole) {
          await this.roleRepository.save(this.roleRepository.create(roleData));
        }
      }
    } catch (error) {
      throw new InternalServerErrorException(
        '¡Ups! Error interno al crear roles',
      );
    }
  }

  // obtiene roles
  async getRoles() {
    try {
      return await this.roleRepository.find();
    } catch (error) {
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // obtiene rol por id (admin)
  async getRoleById(id: number) {
    try {
      const role = await this.roleRepository.findOneBy({ id });
      if (!role) throw new NotFoundException('El rol no existe');
      return role;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // obtiene todos o segun status (admin)
  async getUsersByStatus(status: string) {
    try {
      if (status === 'false') {
        return await this.userRepository.find({
          where: { status: false },
          relations: ['role'],
        });
      }
      if (status === 'true') {
        return await this.userRepository.find({
          where: { status: true },
          relations: ['role'],
        });
      }
      if (status === '*') {
        return await this.userRepository.find({ relations: ['role'] });
      }
      throw new NotFoundException('Solicitud incorrecta');
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // obtiene usuarios por rol (admin)
  async getUsersByRoleId(roleId: number) {
    try {
      return await this.userRepository.find({
        where: { roleId },
        relations: ['role'],
      });
    } catch (error) {
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // obtiene usuario por id (todos los roles)
  async getUserById(id: number) {
    try {
      const person = await this.userRepository.findOne({
        where: { id },
        relations: ['role'],
      });
      if (!person) throw new NotFoundException('La persona no existe');
      return person;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // crear usuario (admin)
  async createUser(dto: CreateUserDto) {
    try {
      const user = await this.userRepository
        .createQueryBuilder('user')
        .where('user.dni = :dni OR user.email = :email', {
          dni: dto.dni,
          email: dto.email,
        })
        .getOne();

      if (user) {
        if (user.dni === dto.dni) {
          throw new BadRequestException('El DNI ya está en uso');
        }
        if (user.email === dto.email) {
          throw new BadRequestException('El correo ya está en uso');
        }
      }
      const createdUser = {
        ...dto,
        nickname: dto.email || `${dto.name}${dto.dni}`,
        username: dto.dni,
        password: dto.dni,
      };
      const savedUser = await this.userRepository.save(
        this.userRepository.create(createdUser),
      );
      delete savedUser.password;
      return savedUser;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // actualizar usuario (admin)
  async updateUser(id: number, dto: UpdateUserDto) {
    try {
      const userFound = await this.getUserById(id);
      if (dto.dni) {
        dto.username = dto.dni;
        dto.password = dto.dni;
      }
      if (dto.email) {
        dto.nickname = dto.email;
      }
      const userUpdate = this.userRepository.merge(userFound, dto);

      // si se cambia el rol
      if (dto.roleId) {
        const newRole = await this.getRoleById(dto.roleId);
        userUpdate.role = newRole;
      }

      return await this.userRepository.save(userUpdate);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('El DNI y/o correo ya están en uso');
      }
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // eliminar usuario (admin)
  async deleteUser(id: number) {
    try {
      const user = await this.getUserById(id);
      return await this.userRepository.remove(user);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }
}
