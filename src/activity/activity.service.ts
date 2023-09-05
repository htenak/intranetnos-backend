import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity, ActivityType } from './entities';
import { Repository } from 'typeorm';
import { CreateActivityTypeDto, UpdateActivityTypeDto } from './dto';
import { AcademicService } from 'src/academic/academic.service';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(ActivityType)
    private readonly activityTypeRepository: Repository<ActivityType>,
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
    private readonly academicService: AcademicService,
  ) {}

  // obtiene tipos de actividad (admin)
  async getActivityTypes() {
    try {
      return await this.activityTypeRepository.find({ relations: [] });
    } catch (error) {
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // obtiene tipos de actividades propias (professor)
  async getActivityTypesProfessor(professorUserId: number) {
    try {
      return await this.activityTypeRepository.find({
        where: { professorUserId },
      });
    } catch (error) {
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // obtiene tipo de actividad propio (professor)
  async getActivityTypeProfessorById(professorUserId: number, id: number) {
    try {
      const activityType = await this.activityTypeRepository.findOne({
        where: { id, professorUserId },
        relations: [],
      });
      if (!activityType) {
        throw new NotFoundException('El tipo de actividad no existe');
      }
      return activityType;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // crea tipo de actividad propia (professor)
  async createAtivityTypeProfessor(
    professorUserId: number,
    dto: CreateActivityTypeDto,
  ) {
    try {
      await this.academicService.getProfessorById(professorUserId);
      const activityType = await this.activityTypeRepository
        .createQueryBuilder('activityType')
        .where(
          `activityType.name = :name AND 
           activityType.professorUserId = :professorUserId`,
          {
            name: dto.name,
            professorUserId: professorUserId,
          },
        )
        .getOne();
      if (activityType) {
        throw new ConflictException('El tipo de actividad ya existe');
      }
      const createdActivityType = {
        ...dto,
        professorUserId,
      };
      return await this.activityTypeRepository.save(
        this.activityTypeRepository.create(createdActivityType),
      );
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // actualiza tipo de actividad propio (professor)
  async updateActivityTypeProfessor(
    professorUserId: number,
    id: number,
    dto: UpdateActivityTypeDto,
  ) {
    try {
      await this.academicService.getProfessorById(professorUserId);
      const activityTypeFound = await this.getActivityTypeProfessorById(
        professorUserId,
        id,
      );
      return await this.activityTypeRepository.save(
        this.activityTypeRepository.merge(activityTypeFound, dto),
      );
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // elimina el tipo de actividad propio (professor)
  async deleteActivityTypeProfessor(professorUserId: number, id: number) {
    try {
      await this.academicService.getProfessorById(professorUserId);
      const activityType = await this.getActivityTypeProfessorById(
        professorUserId,
        id,
      );
      return await this.activityTypeRepository.remove(activityType);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        throw new ConflictException('¡Denegado! Registro en uso');
      }
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }
}
