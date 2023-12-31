import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Day, Schedule } from './entities';
import { Repository } from 'typeorm';
import { CreateScheduleDto, UpdateScheduleDto } from './dto';
import { ClassService } from 'src/class/class.service';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Day) private readonly dayRepository: Repository<Day>,
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
    private readonly classService: ClassService,
  ) {}

  // crea los días si no existen
  async createDaysIfNotExist() {
    try {
      const days = [
        { name: 'Lunes' },
        { name: 'Martes' },
        { name: 'Miercoles' },
        { name: 'Jueves' },
        { name: 'Viernes' },
        { name: 'Sábado' },
        { name: 'Domingo' },
      ];
      for (const dayData of days) {
        const existRole = await this.dayRepository.findOne({
          where: { name: dayData.name },
        });
        if (!existRole) {
          await this.dayRepository.save(this.dayRepository.create(dayData));
        }
      }
    } catch (error) {
      throw new InternalServerErrorException(
        '¡Ups! Error interno al crear días',
      );
    }
  }

  // obtener días (todos)
  async getDays() {
    try {
      return await this.dayRepository.find({ relations: ['schedules'] });
    } catch (error) {
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // obtiene un día por id (admin)
  async getDayById(id: number) {
    try {
      const day = await this.dayRepository.findOne({
        where: { id },
      });
      if (!day) throw new NotFoundException('El día no existe');
      return day;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // obtiene horarios (admin)
  async getSchedules() {
    try {
      return await this.scheduleRepository.find({
        relations: ['day', 'classs'],
      });
    } catch (error) {
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // obtiene horario por id (admin)
  async getScheduleById(id: number) {
    try {
      const schedule = await this.scheduleRepository.findOne({
        where: { id },
        relations: ['day', 'classs'],
      });
      if (!schedule) throw new NotFoundException('El horario no existe');
      return schedule;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // crear horario (admin)
  async createSchedule(dto: CreateScheduleDto) {
    try {
      await this.getDayById(dto.dayId); //valida que el día exista
      await this.classService.getClassById(dto.classId); //valida que la clase exista
      const schedule = await this.scheduleRepository
        .createQueryBuilder('sch')
        .where(
          `sch.startTime = :startTime AND
           sch.endTime = :endTime AND
           sch.dayId = :dayId AND
           sch.classId = :classId`,
          {
            startTime: dto.startTime,
            endTime: dto.endTime,
            dayId: dto.dayId,
            classId: dto.classId,
          },
        )
        .getOne();
      if (schedule) throw new ConflictException('El horario ya existe');
      const newSaved = await this.scheduleRepository.save(
        this.scheduleRepository.create(dto),
      );
      return await this.getScheduleById(newSaved.id);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // actualiza horario (admin)
  async updateSchedule(id: number, dto: UpdateScheduleDto) {
    try {
      const scheduleFound = await this.getScheduleById(id);
      // verifico si el horario ya existe
      const schedule = await this.scheduleRepository
        .createQueryBuilder('sch')
        .where(
          `sch.id != :id AND
           sch.startTime = :startTime AND
           sch.endTime = :endTime AND
           sch.dayId = :dayId AND
           sch.classId = :classId`,
          {
            id,
            startTime: dto.startTime,
            endTime: dto.endTime,
            dayId: dto.dayId,
            classId: dto.classId,
          },
        )
        .getOne();
      if (schedule) throw new ConflictException('El horario ya existe');
      const scheduleUpdate = this.scheduleRepository.merge(scheduleFound, dto);
      // si se cambia día
      if (dto.dayId) {
        const newDay = await this.getDayById(dto.dayId);
        scheduleUpdate.day = newDay;
      }
      // si se cambia clase
      if (dto.classId) {
        const newClass = await this.classService.getClassById(dto.classId);
        scheduleUpdate.classs = newClass;
      }
      return await this.scheduleRepository.save(scheduleUpdate);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // elimina horario (admin)
  async deleteSchedule(id: number) {
    try {
      const scheduleFound = await this.getScheduleById(id);
      return await this.scheduleRepository.remove(scheduleFound);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        throw new ConflictException('¡Denegado! Registro en uso');
      }
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // obtiene horario(s) por classId (profesor)
  async getSchedulesByClassId(classId: number) {
    try {
      await this.classService.getClassById(classId);
      return await this.scheduleRepository
        .createQueryBuilder('sch')
        .leftJoinAndSelect('sch.day', 'day')
        .where('sch.classId = :classId', { classId })
        .getMany();
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }
}
