import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { join } from 'path';
import { unlinkSync } from 'fs';
import { Role, User } from './entities';
import {
  CreateUserDto,
  UpdateMyUserDto,
  UpdateUserDto,
  UploadMyPhotoDto,
} from './dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {}

  /**
   * ROLES:
   */

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

  // obtiene role por nombre
  async getRoleByName(name: string) {
    try {
      const roleFound = await this.roleRepository.findOneBy({ name });
      if (!roleFound) throw new NotFoundException('El rol no existe');
      return roleFound;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  /**
   * USUARIOS:
   */

  // crea el primer administrador
  async createAdminIfNotExist() {
    try {
      const role = await this.getRoleByName('admin');
      const firstAdmin = [
        {
          name: 'ADMIN',
          lastName1: 'ADMIN',
          lastName2: 'ADMIN',
          dni: '00000000',
          phone: '000000000',
          nickname: 'admin',
          username: '00000000',
          password: '00000000',
          roleId: role.id,
        },
      ];
      for (const adminData of firstAdmin) {
        const existAdmin = await this.userRepository.findOne({
          where: { dni: adminData.dni },
        });
        if (!existAdmin) {
          await this.userRepository.save(this.userRepository.create(adminData));
        }
      }
    } catch (error) {
      throw new InternalServerErrorException(
        '¡Ups! Error interno al crear el primer administrador',
      );
    }
  }

  // crea usuario para invitados (no tiene acceso a ningun recurso)
  async createUserIfNotExist() {
    try {
      const role = await this.getRoleByName('user');
      const firstAdmin = [
        {
          name: 'INVITADO',
          lastName1: 'INVITADO',
          lastName2: 'INVITADO',
          dni: '00000001',
          phone: '000000000',
          nickname: 'USUARIO',
          username: 'user',
          password: '123',
          roleId: role.id,
        },
      ];
      for (const adminData of firstAdmin) {
        const existAdmin = await this.userRepository.findOne({
          where: { dni: adminData.dni },
        });
        if (!existAdmin) {
          await this.userRepository.save(this.userRepository.create(adminData));
        }
      }
    } catch (error) {
      throw new InternalServerErrorException(
        '¡Ups! Error interno al crear el primer administrador',
      );
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
      if (!person) throw new NotFoundException('Usuario no encontrado');
      return person;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // obtiene usuario por id y rol (todos los roles)
  async getUserByIdAndRoleId(id: number, roleId: number) {
    try {
      const person = await this.userRepository.findOne({
        where: { id, roleId },
        relations: ['role', 'classes', 'studentsClass', 'studentsClass.classs'],
        //añadir más relaciones segun necesidad ya sea estudiante o professor
      });
      if (!person) throw new NotFoundException('Usuario no encontrado');
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
          throw new ConflictException('El DNI ya está en uso');
        }
        if (user.email === dto.email) {
          throw new ConflictException('El correo ya está en uso');
        }
      }
      const createdUser = {
        ...dto,
        nickname: dto.email || `${dto.lastName1}${dto.dni}`,
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
        // si no se cambia el dni mantener la password
        if (dto.dni === userFound.dni) {
          delete dto.dni;
        } else {
          dto.username = dto.dni;
          dto.password = dto.dni;
        }
      }
      if (dto.email) {
        // si no se cambia el email mantener el nickname
        if (dto.email === userFound.email) {
          delete dto.email;
        } else {
          dto.nickname = dto.email;
        }
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
  async deleteUser(idAdmin: number, idUser: number) {
    try {
      const userAdmin = await this.getUserById(idAdmin);
      const userUser = await this.getUserById(idUser);
      if (userAdmin.id === userUser.id) {
        throw new ConflictException('No puedes eliminarte a ti mismo');
      }
      return await this.userRepository.remove(userUser);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        throw new ConflictException('¡Denegado! Registro en uso');
      }
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // actualizar mi perfil (propio)
  async updateMyData(id: number, dto: UpdateMyUserDto) {
    try {
      const userFound = await this.getUserById(id);
      const userSaved = await this.userRepository.save(
        this.userRepository.merge(userFound, dto),
      );
      delete userSaved.password;
      delete userSaved.createdAt;
      return userSaved;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('El correo ya está en uso');
      }
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // subir foto de perfil (propio)
  async uploadPhoto(id: number, dto: UploadMyPhotoDto) {
    try {
      const myUser = await this.getUserById(id);
      if (!dto) throw new NotFoundException('No has enviado ninguna foto');
      return await this.userRepository.save(
        this.userRepository.merge(myUser, dto),
      );
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // eliminar foto de perfil (propio)
  async deletePhoto(id: number) {
    try {
      const myUser = await this.getUserById(id);
      if (!myUser.filename) throw new NotFoundException('Sin foto de perfil');
      const filePath = join(__dirname, '..', '..', 'uploads', myUser.filename);
      unlinkSync(filePath);
      return await this.userRepository.save(
        this.userRepository.merge(myUser, { filename: null }),
      );
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }
}
