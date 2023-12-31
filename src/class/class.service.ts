import {
  BadRequestException,
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
  UploadCoverPhotoClass,
} from './dto';
import { AcademicService } from 'src/academic/academic.service';
import { join } from 'path';
import { unlinkSync } from 'fs';

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
        // relations: ['cycle', 'career', 'course', 'professor', 'studentsClass'],
        relations: ['career'],
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
        // relations: ['cycle', 'career', 'course', 'professor'],
        relations: ['career'],
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
      await this.academicService.getClassroomCareerById(dto.classroomCareerId);
      await this.academicService.getCourseById(dto.courseId);
      await this.academicService.getProfessorById(dto.professorUserId);
      const classs = await this.classRepository
        .createQueryBuilder('class')
        .where(
          `class.cycleId = :cycleId AND 
           class.careerId = :careerId AND 
           class.classroomCareerId = :classroomCareerId AND 
           class.courseId = :courseId AND 
           class.professorUserId = :professorUserId`,
          {
            cycleId: dto.cycleId,
            careerId: dto.careerId,
            classroomCareerId: dto.classroomCareerId,
            courseId: dto.courseId,
            professorUserId: dto.professorUserId,
          },
        )
        .getOne();
      if (classs) throw new ConflictException('La clase ya existe');
      const newSaved = await this.classRepository.save(
        this.classRepository.create(dto),
      );
      return await this.getClassById(newSaved.id);
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
            class.classroomCareerId = :classroomCareerId AND 
            class.courseId = :courseId AND 
            class.professorUserId = :professorUserId`,
          {
            id,
            cycleId: dto.cycleId,
            careerId: dto.careerId,
            classroomCareerId: dto.classroomCareerId,
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
      if (dto.classroomCareerId) {
        const newCC = await this.academicService.getClassroomCareerById(
          dto.classroomCareerId,
        );
        classUpdate.classroomCareer = newCC;
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

  // obtiene todas las clases estudiantes (admin)
  async getStudentClasses() {
    try {
      return await this.studentClassRepository.find({
        relations: ['student', 'classs'],
      });
    } catch (error) {
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // obtiene estudiantes por clase
  async getStudentsByClassId(classId: number) {
    try {
      return await this.studentClassRepository
        .createQueryBuilder('studentClass')
        .leftJoin('studentClass.student', 'student')
        .addSelect([
          'student.name',
          'student.lastName1',
          'student.lastName2',
          'student.filename',
        ])
        .where('studentClass.classId = :classId', { classId })
        .getMany();
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
          {
            classId: dto.classId,
            studentUserId: dto.studentUserId,
          },
        )
        .getOne();
      if (studentClass) {
        throw new ConflictException('El estudiante ya está en esta clase');
      }
      const newSaved = await this.studentClassRepository.save(
        this.studentClassRepository.create(dto),
      );
      return await this.getStudentClassById(newSaved.id);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // actualiza clase estudiante (admin)
  async updateStudentClass(id: number, dto: UpdateStudentClassDto) {
    try {
      const studentClassFound = await this.getStudentClassById(id);
      // verifico si la clase del estudiante ya existe
      const studentClass = await this.studentClassRepository
        .createQueryBuilder('studentClass')
        .where(
          `studentClass.id != :id AND 
            studentClass.classId = :classId AND 
            studentClass.studentUserId = :studentUserId`,
          { id, classId: dto.classId, studentUserId: dto.studentUserId },
        )
        .getOne();
      if (studentClass) {
        throw new ConflictException('El estudiante ya está en esta clase');
      }
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
      await this.academicService.getProfessorById(professorUserId);
      const classes = await this.classRepository.find({
        where: { professorUserId },
        relations: ['cycle', 'career', 'course'],
      });
      return classes;
    } catch (error) {
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // obtiene clase según profesor (professor)
  async getClassProfessorById(professorUserId: number, id: number) {
    try {
      await this.academicService.getProfessorById(professorUserId);
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

  // obtiene todas las clases con datos del profesor
  async getAllClassesAndFilters(parameters: number[]) {
    const careerId = parameters[0];
    const cycleId = parameters[1];
    const professorId = parameters[2];

    try {
      const query = this.classRepository
        .createQueryBuilder('class')
        .leftJoin('class.career', 'career')
        .leftJoin('class.cycle', 'cycle')
        .leftJoin('class.professor', 'professor')
        .select([
          'class.id',
          'class.denomination',
          'class.filename',
          'class.status',
          'class.createdAt',
          'career.name',
          'professor.name',
          'professor.email',
          'professor.lastName1',
          'professor.lastName2',
          'professor.filename',
        ]);

      if (careerId != 0) {
        query.andWhere('career.id = :careerId', { careerId });
      }
      if (cycleId != 0) {
        query.andWhere('cycle.id = :cycleId', { cycleId });
      }
      if (professorId != 0) {
        query.andWhere('professor.id = :professorId', { professorId });
      }
      return await query.getMany();
    } catch (error) {
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // guarda foto de la clase (professor)
  async uploadCoverPhotoClass(classId: number, dto: UploadCoverPhotoClass) {
    try {
      if (!dto) throw new BadRequestException('No has enviado ninguna foto');
      const classs = await this.getClassById(classId);
      // queda pendiente validar si la clase le pertenece al profesor
      return await this.classRepository.save(
        this.classRepository.merge(classs, dto),
      );
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // elimina foto de la clase (professor)
  async deleteCoverPhotoClass(id: number) {
    try {
      const classs = await this.getClassById(id);
      if (!classs.filename) throw new NotFoundException('Clase sin foto');
      // queda pendiente validar si la clase le pertenece al profesor
      const filePath = join(
        __dirname,
        '..',
        '..',
        'uploads',
        'classes-photos',
        classs.filename,
      );
      unlinkSync(filePath);
      return await this.classRepository.save(
        this.classRepository.merge(classs, { filename: null }),
      );
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }
}
