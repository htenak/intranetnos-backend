import {
  ConflictException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity, ActivityType } from './entities';
import { Repository } from 'typeorm';
import {
  CreateActivityDto,
  CreateActivityTypeDto,
  UpdateActivityDto,
  UpdateActivityTypeDto,
} from './dto';
import { ClassService } from 'src/class/class.service';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(ActivityType)
    private readonly activityTypeRepository: Repository<ActivityType>,
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
    private readonly classService: ClassService,
  ) {}

  // obtiene tipos de actividad (admin)
  async getActivityTypes() {
    try {
      return await this.activityTypeRepository.find({ relations: [] });
    } catch (error) {
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // obtiene todas las actividades (admin)
  async getActivities() {
    try {
      return await this.activityRepository.find({ relations: [] });
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

  // obtiene actividades propias (professor)
  async getActivitiesProfessor(professorUserId: number) {
    try {
      return await this.activityRepository.find({
        where: { professorUserId },
        relations: [],
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // obtiene actividad propia (profesor)
  async getActivityProfessorById(professorUserId: number, id: number) {
    try {
      const activity = await this.activityRepository.findOne({
        where: { id, professorUserId },
        relations: [],
      });
      if (!activity) {
        throw new NotFoundException('La actividad no existe');
      }
      return activity;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // crea actividad propia (professor)
  async createAtivityProfessor(
    professorUserId: number,
    dto: CreateActivityDto,
  ) {
    try {
      await this.getActivityTypeProfessorById(
        professorUserId,
        dto.activityTypeId,
      );
      await this.classService.getClassProfessorById(
        professorUserId,
        dto.classId,
      );
      const createdActivity = {
        ...dto,
        professorUserId,
      };
      return await this.activityRepository.save(
        this.activityRepository.create(createdActivity),
      );
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // actualiza actividad propia (profesor)
  async updateActivityProfessor(
    professorUserId: number,
    id: number,
    dto: UpdateActivityDto,
  ) {
    try {
      const activityFound = await this.getActivityProfessorById(
        professorUserId,
        id,
      );
      const activityUpdate = this.activityRepository.merge(activityFound, dto);
      if (dto.activityTypeId) {
        const newActivityType = await this.getActivityTypeProfessorById(
          professorUserId,
          dto.activityTypeId,
        );
        activityUpdate.activityType = newActivityType;
      }
      if (dto.classId) {
        const newClass = await this.classService.getClassProfessorById(
          professorUserId,
          dto.classId,
        );
        activityUpdate.classs = newClass;
      }
      return await this.activityRepository.save(activityUpdate);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // ellimina actividad propia (profesor)
  async deleteActivityProfessor(professorUserId: number, id: number) {
    try {
      const activity = await this.getActivityProfessorById(professorUserId, id);
      return await this.activityRepository.remove(activity);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        throw new ConflictException('¡Denegado! Registro en uso');
      }
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }
}
