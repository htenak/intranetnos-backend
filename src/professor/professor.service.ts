import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Career, Cycle } from 'src/academic/entities';
import { User } from 'src/user/entities';
import { ClassService } from 'src/class/class.service';

@Injectable()
export class ProfessorService {
  constructor(
    @InjectRepository(Career)
    private readonly careerRepository: Repository<Career>,
    @InjectRepository(Cycle)
    private readonly cycleRepository: Repository<Cycle>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // obtiene carreras
  async getCareers() {
    try {
      return await this.careerRepository.find();
    } catch (error) {
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // obtiene ciclos
  async getCycles() {
    try {
      return await this.cycleRepository.find();
    } catch (error) {
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // obtiene usuarios del mismo rol
  async getColleagues(roleName: number) {
    try {
      return await this.userRepository
        .createQueryBuilder('user')
        .leftJoin('user.role', 'role')
        .where('role.name = :roleName', { roleName })
        .getMany();
    } catch (error) {
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // obtiene y filtra todos los alumnos de un profesor
  async getPupils(professorId: number, parameters: number[]) {
    const careerId = parameters[0];
    const cycleId = parameters[1];

    try {
      const query = this.userRepository
        .createQueryBuilder('user')
        .innerJoin('user.studentsClass', 'sc')
        .innerJoin('sc.classs', 'class')
        .select(['user', 'sc', 'class.careerId', 'class.cycleId'])
        .where('class.professorUserId = :professorId', { professorId });
      // query.andWhere('class.professorUserId = :professorId', { professorId });
      if (careerId != 0) {
        query.andWhere('class.careerId = :careerId', { careerId });
      }
      if (cycleId != 0) {
        query.andWhere('class.cycleId = :cycleId', { cycleId });
      }
      return await query.getMany();
    } catch (error) {
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }
}
