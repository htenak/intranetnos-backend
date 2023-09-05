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
      return await this.scheduleRepository.find();
    } catch (error) {
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // obtiene horario por id (admin)
  async getScheduleById(id: number) {
    try {
      const schedule = await this.scheduleRepository.findOne({
        where: { id },
        relations: ['classs', 'classs.career', 'day'],
        // agregar mas relaciones segun necesidad
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
      return await this.scheduleRepository.save(
        this.scheduleRepository.create(dto),
      );
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // actualiza horario (admin)
  async updateSchedule(id: number, dto: UpdateScheduleDto) {
    try {
      const scheduleFound = await this.getScheduleById(id);
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
}
