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
import { Class, StudentClass } from './entities';
import { Repository } from 'typeorm';

import {
  CreateClassDto,
  CreateStudentClassDto,
  UpdateClassDto,
  UpdateStudentClassDto,
} from './dto';
import { AcademicService } from 'src/academic/academic.service';

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
    @InjectRepository(StudentClass)
    private readonly studentClassRepository: Repository<StudentClass>,

    // dependencia circular
    @Inject(forwardRef(() => AcademicService))
    private readonly academicService: AcademicService,
  ) {}

  // obtiene clases (admin)
  async getClasses() {
    try {
      return await this.classRepository.find({
        relations: ['cycle', 'career', 'course', 'professor', 'studentsClass'],
      });
    } catch (error) {
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // obtiene clase por id (admin)
  async getClassById(id: number) {
    try {
      const classs = await this.classRepository.findOne({
        where: { id },
        relations: ['cycle', 'career', 'course', 'professor', 'studentsClass'],
      });
      if (!classs) throw new NotFoundException('La clase no existe');
      return classs;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // crea clase (admin)
  async createClass(dto: CreateClassDto) {
    try {
      await this.academicService.getCycleById(dto.cycleId);
      await this.academicService.getCareerById(dto.careerId);
      await this.academicService.getCourseById(dto.courseId);
      await this.academicService.getProfessorById(dto.professorUserId);
      const classs = await this.classRepository
        .createQueryBuilder('class')
        .where(
          `class.cycleId = :cycleId AND 
           class.careerId = :careerId AND 
           class.courseId = :courseId AND 
           class.professorUserId = :professorUserId`,
          {
            cycleId: dto.cycleId,
            careerId: dto.careerId,
            courseId: dto.courseId,
            professorUserId: dto.professorUserId,
          },
        )
        .getOne();
      if (classs) throw new ConflictException('La clase ya existe');
      return await this.classRepository.save(this.classRepository.create(dto));
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // actualiza clase (admin)
  async updateClass(id: number, dto: UpdateClassDto) {
    try {
      const classFound = await this.getClassById(id);
      // primero verifico si la clase ya existe
      const classs = await this.classRepository
        .createQueryBuilder('class')
        .where(
          `class.id != :id AND
              class.cycleId = :cycleId AND 
              class.careerId = :careerId AND 
              class.courseId = :courseId AND 
              class.professorUserId = :professorUserId`,
          {
            id,
            cycleId: dto.cycleId,
            careerId: dto.careerId,
            courseId: dto.courseId,
            professorUserId: dto.professorUserId,
          },
        )
        .getOne();
      if (classs) throw new ConflictException('La clase ya existe');
      const classUpdate = this.classRepository.merge(classFound, dto);
      if (dto.cycleId) {
        const newCycle = await this.academicService.getCycleById(dto.cycleId);
        classUpdate.cycle = newCycle;
      }
      if (dto.careerId) {
        const newCareer = await this.academicService.getCareerById(
          dto.careerId,
        );
        classUpdate.career = newCareer;
      }
      if (dto.courseId) {
        const newCourse = await this.academicService.getCourseById(
          dto.courseId,
        );
        classUpdate.course = newCourse;
      }
      if (dto.professorUserId) {
        const newProfessor = await this.academicService.getProfessorById(
          dto.professorUserId,
        );
        classUpdate.professor = newProfessor;
      }
      return await this.classRepository.save(classUpdate);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // elimina clase (admin)
  async deleteClass(id: number) {
    try {
      const classs = await this.getClassById(id);
      return await this.classRepository.remove(classs);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        throw new ConflictException('¡Denegado! Registro en uso');
      }
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // obtiene clases estudiantes (admin)
  async getStudentClasses() {
    try {
      return await this.studentClassRepository.find({
        relations: ['student', 'classs'],
      });
    } catch (error) {
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // obtiene clase estudiante (admin)
  async getStudentClassById(id: number) {
    try {
      const studentClass = await this.studentClassRepository.findOne({
        where: { id },
        relations: ['student', 'classs', 'classs.career'],
      });
      if (!studentClass) {
        throw new NotFoundException('La clase del estudiante no existe');
      }
      return studentClass;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // crea clase estudiante (admin)
  async createStudentClass(dto: CreateStudentClassDto) {
    try {
      await this.getClassById(dto.classId);
      await this.academicService.getStudentById(dto.studentUserId);
      const studentClass = await this.studentClassRepository
        .createQueryBuilder('studentClass')
        .where(
          'studentClass.classId = :classId AND studentClass.studentUserId = :studentUserId',
          { classId: dto.classId, studentUserId: dto.studentUserId },
        )
        .getOne();
      if (studentClass) {
        throw new ConflictException('La clase del estudiante ya existe');
      }
      return await this.studentClassRepository.save(
        this.studentClassRepository.create(dto),
      );
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // actualiza clase estudiante (admin)
  async updateStudentClass(id: number, dto: UpdateStudentClassDto) {
    try {
      const studentClassFound = await this.getStudentClassById(id);
      const studentClassUpdate = this.studentClassRepository.merge(
        studentClassFound,
        dto,
      );
      if (dto.classId) {
        const newClass = await this.getClassById(dto.classId);
        studentClassUpdate.classs = newClass;
      }
      if (dto.studentUserId) {
        const newStudent = await this.academicService.getStudentById(
          dto.studentUserId,
        );
        studentClassUpdate.student = newStudent;
      }
      return await this.studentClassRepository.save(studentClassUpdate);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // elimina clase del estudiante (admin)
  async deleteStudentClass(id: number) {
    try {
      const studentClass = await this.getStudentClassById(id);
      return await this.studentClassRepository.remove(studentClass);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        throw new ConflictException('¡Denegado! Registro en uso');
      }
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // obtiene clases según profesor (professor)
  async getClassesProfessor(professorUserId: number) {
    try {
      // await this.academicService.getProfessorById(professorUserId);
      const classes = await this.classRepository.find({
        where: { professorUserId },
      });
      return classes;
    } catch (error) {
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // obtiene clase según profesor (professor)
  async getClassProfessorById(professorUserId: number, id: number) {
    try {
      // await this.academicService.getProfessorById(professorUserId);
      const classs = await this.classRepository.findOne({
        where: { id, professorUserId },
      });
      if (!classs)
        throw new NotFoundException('La clase del profesor no existe');
      return classs;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }
}
