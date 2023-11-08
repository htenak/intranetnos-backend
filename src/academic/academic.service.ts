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
import { Repository } from 'typeorm';
import { Career, Classroom, Course, CourseType, Cycle } from './entities';
import {
  CreateCareerDto,
  CreateClassroomDto,
  CreateCourseDto,
  CreateCourseTypeDto,
  CreateCycleDto,
  UpdateCareerDto,
  UpdateClassroomDto,
  UpdateCourseDto,
  UpdateCourseTypeDto,
  UpdateCycleDto,
} from './dto';
import { UserService } from 'src/user/user.service';
import { ClassService } from 'src/class/class.service';
import { ActivityService } from 'src/activity/activity.service';

@Injectable()
export class AcademicService {
  constructor(
    @InjectRepository(Career)
    private readonly careerRepository: Repository<Career>,
    @InjectRepository(Classroom)
    private readonly classroomRepository: Repository<Classroom>,
    @InjectRepository(Cycle)
    private readonly cycleRepository: Repository<Cycle>,
    @InjectRepository(CourseType)
    private readonly courseTypeRepository: Repository<CourseType>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    private readonly userService: UserService,
    private readonly activityService: ActivityService,

    // dependencia circular
    @Inject(forwardRef(() => ClassService))
    private readonly classService: ClassService,
  ) {}

  // obtiene carreras (admin)
  async getCareers() {
    try {
      return await this.careerRepository.find({ relations: ['courses'] });
    } catch (error) {
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // obtiene carrera por id (admin)
  async getCareerById(id: number) {
    try {
      const career = await this.careerRepository.findOne({
        where: { id },
        relations: ['courses'],
      });
      if (!career) throw new NotFoundException('La carrera no existe');
      return career;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // crear carrera (admin)
  async createCareer(dto: CreateCareerDto) {
    try {
      const career = await this.careerRepository.findOneBy({ name: dto.name });
      if (career) {
        throw new ConflictException('El nombre de la carrera ya existe');
      }
      return this.careerRepository.save(this.careerRepository.create(dto));
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // actualizar carrera (admin)
  async updateCareer(id: number, dto: UpdateCareerDto) {
    try {
      const careerFound = await this.getCareerById(id);
      return await this.careerRepository.save(
        this.careerRepository.merge(careerFound, dto),
      );
    } catch (error) {
      if (error instanceof HttpException) throw error;
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('El nombre de la carrera ya existe');
      }
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // eliminar carrera (admin)
  async deleteCareer(id: number) {
    try {
      const career = await this.getCareerById(id);
      return await this.careerRepository.remove(career);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        throw new ConflictException('¡Denegado! Registro en uso');
      }
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // obtiene carreras (admin)
  async getClassrooms() {
    try {
      return await this.classroomRepository.find({ relations: [] });
    } catch (error) {
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // obtiene carrera por id (admin)
  async getClassroomById(id: number) {
    try {
      const classroom = await this.classroomRepository.findOne({
        where: { id },
        relations: [],
      });
      if (!classroom) throw new NotFoundException('El aula no existe');
      return classroom;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // crear carrera (admin)
  async createClassroom(dto: CreateClassroomDto) {
    try {
      const classroom = await this.classroomRepository.findOneBy({
        number: dto.number,
      });
      if (classroom) {
        throw new ConflictException('El número de aula ya existe');
      }
      return this.classroomRepository.save(
        this.classroomRepository.create(dto),
      );
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // actualizar carrera (admin)
  async updateClassroom(id: number, dto: UpdateClassroomDto) {
    try {
      const classroomFound = await this.getClassroomById(id);
      return await this.classroomRepository.save(
        this.classroomRepository.merge(classroomFound, dto),
      );
    } catch (error) {
      if (error instanceof HttpException) throw error;
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('El número de aula ya existe');
      }
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // eliminar carrera (admin)
  async deleteClassroom(id: number) {
    try {
      const classroom = await this.getClassroomById(id);
      return await this.classroomRepository.remove(classroom);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        throw new ConflictException('¡Denegado! Registro en uso');
      }
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // obtiene ciclo (admin)
  async getCycles() {
    try {
      return await this.cycleRepository.find();
    } catch (error) {
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // obtiene ciclo por id (admin)
  async getCycleById(id: number) {
    try {
      const cycle = await this.cycleRepository.findOneBy({ id });
      if (!cycle) throw new NotFoundException('El ciclo no existe');
      return cycle;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // crear ciclo (admin)
  async createCycle(dto: CreateCycleDto) {
    try {
      const cycle = await this.cycleRepository
        .createQueryBuilder('cycle')
        .where(
          'cycle.abbreviation = :abbreviation OR cycle.description = :description',
          {
            abbreviation: dto.abbreviation,
            description: dto.description,
          },
        )
        .getOne();
      if (cycle) {
        throw new ConflictException('Abreviación y/o descripción ya existen');
      }
      return this.cycleRepository.save(this.cycleRepository.create(dto));
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // actualizar ciclo (admin)
  async updateCycle(id: number, dto: UpdateCycleDto) {
    try {
      const cycleFound = await this.getCycleById(id);
      return await this.cycleRepository.save(
        this.cycleRepository.merge(cycleFound, dto),
      );
    } catch (error) {
      if (error instanceof HttpException) throw error;
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Abreviación y/o descripción ya existen');
      }
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // eliminar ciclo (admin)
  async deleteCycle(id: number) {
    try {
      const cycle = await this.getCycleById(id);
      return await this.cycleRepository.remove(cycle);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        throw new ConflictException('¡Denegado! Registro en uso');
      }
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // obtiene tipos de curso (admin)
  async getCourseTypes() {
    try {
      return await this.courseTypeRepository.find({
        relations: ['courses'],
      });
    } catch (error) {
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // obtiene cursos por cycleId
  async getCoursesByCycleId(cycleId: number) {
    try {
      return await this.courseRepository
        .createQueryBuilder('course')
        .leftJoin('course.classes', 'class')
        .where('class.cycleId = :cycleId', { cycleId })
        .getMany();
    } catch (error) {
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // obtiene tipo de curso por id (admin)
  async getCourseTypeById(id: number) {
    try {
      const courseType = await this.courseTypeRepository.findOneBy({ id });
      if (!courseType)
        throw new NotFoundException('El tipo de curso no existe');
      return courseType;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // crear tipo de curso (admin)
  async createCourseType(dto: CreateCourseTypeDto) {
    try {
      const courseType = await this.courseTypeRepository.findOneBy({
        name: dto.name,
      });
      if (courseType) {
        throw new ConflictException('El nombre del tipo de curso ya existe');
      }
      return this.courseTypeRepository.save(
        this.courseTypeRepository.create(dto),
      );
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // actualizar tipo de curso (admin)
  async updateCourseType(id: number, dto: UpdateCourseTypeDto) {
    try {
      const courseType = await this.getCourseTypeById(id);
      return await this.courseTypeRepository.save(
        this.courseTypeRepository.merge(courseType, dto),
      );
    } catch (error) {
      if (error instanceof HttpException) throw error;
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('El nombre del tipo de curso ya existe');
      }
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // eliminar tipo de curso (admin)
  async deleteCourseType(id: number) {
    try {
      const courseType = await this.getCourseTypeById(id);
      return await this.courseTypeRepository.remove(courseType);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        throw new ConflictException('¡Denegado! Registro en uso');
      }
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // obtiene cursos (admin)
  async getCourses() {
    try {
      return await this.courseRepository.find({
        relations: ['courseType', 'career'],
      });
    } catch (error) {
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // obtiene curso (admin)
  async getCourseById(id: number) {
    try {
      const course = await this.courseRepository.findOne({
        where: { id },
        relations: ['courseType', 'career'],
      });
      if (!course) throw new NotFoundException('El curso no existe');
      return course;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // crea curso (admin)
  async createCourse(dto: CreateCourseDto) {
    try {
      const course = await this.courseRepository
        .createQueryBuilder('course')
        .where('course.name = :name OR course.abbreviation = :abbreviation', {
          name: dto.name,
          abbreviation: dto.abbreviation,
        })
        .getOne();
      if (course) {
        if (course.name === dto.name) {
          throw new ConflictException('El nombre del curso ya existe');
        }
        if (course.abbreviation === dto.abbreviation) {
          throw new ConflictException('La abreviación del curso ya existe');
        }
      }
      const newSaved = await this.courseRepository.save(
        this.courseRepository.create(dto),
      );
      return await this.getCourseById(newSaved.id);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // actualiza curso (admin)
  async updateCourse(id: number, dto: UpdateCourseDto) {
    try {
      const courseFound = await this.getCourseById(id);
      const courseUpdate = this.courseRepository.merge(courseFound, dto);

      // si se cambia el tipo de curso
      if (dto.courseTypeId) {
        const newCourseType = await this.getCourseTypeById(dto.courseTypeId);
        courseUpdate.courseType = newCourseType;
      }
      // si se cambia carrera
      if (dto.careerId) {
        const newCareer = await this.getCareerById(dto.careerId);
        courseUpdate.career = newCareer;
        // si no establecer en null (carrera es opcional)
      } else {
        courseUpdate.career = null;
      }
      return await this.courseRepository.save(courseUpdate);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(
          'El nombre y/o abreviación del curso ya existen',
        );
      }
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // actualizar estado de curso (admin)
  async updateStatusCourse(id: number, status: boolean) {
    try {
      const courseFound = await this.getCourseById(id);
      return await this.courseRepository.save(
        this.courseRepository.merge(courseFound, { status }),
      );
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // elimina curso (admin)
  async deleteCourse(id: number) {
    try {
      const course = await this.getCourseById(id);
      return await this.courseRepository.remove(course);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        throw new ConflictException('¡Denegado! Registro en uso');
      }
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // obtiene profesores (admin)
  async getProfessors() {
    try {
      const role = await this.userService.getRoleByName('professor');
      return await this.userService.getUsersByRoleId(role.id);
    } catch (error) {
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // obtiene profesor por id (admin)
  async getProfessorById(id: number) {
    try {
      const role = await this.userService.getRoleByName('professor');
      return await this.userService.getUserByIdAndRoleId(id, role.id);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // obtiene estudiantes (admin)
  async getStudents() {
    try {
      const role = await this.userService.getRoleByName('student');
      return await this.userService.getUsersByRoleId(role.id);
    } catch (error) {
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  // obtiene estudiante por id (admin)
  async getStudentById(id: number) {
    try {
      const role = await this.userService.getRoleByName('student');
      return await this.userService.getUserByIdAndRoleId(id, role.id);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }

  /* obtiene totales de: usuarios
   * (admin, professor, student),
   * carreras y cursos
   * (todos)
   */
  async getTotalsAcademic() {
    try {
      const adminRole = await this.userService.getRoleByName('admin');
      const invitedRole = await this.userService.getRoleByName('user');

      const users = await this.userService.getUsersByStatus('*');
      const admins = await this.userService.getUsersByRoleId(adminRole.id);
      const professors = await this.getProfessors();
      const students = await this.getStudents();
      const inviteds = await this.userService.getUsersByRoleId(invitedRole.id);
      const careers = await this.getCareers();
      const courses = await this.getCourses();
      const classes = await this.classService.getClasses();
      const activities = await this.activityService.getActivities();
      return {
        totalUsers: users.length,
        totalAdmins: admins.length,
        totalProfessors: professors.length,
        totalStudents: students.length,
        totalInviteds: inviteds.length,
        totalCareers: careers.length,
        totalCourses: courses.length,
        totalClasses: classes.length,
        totalActivities: activities.length,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('¡Ups! Error interno');
    }
  }
}
