import { Career, Course, Cycle } from 'src/academic/entities';
import { Schedule } from 'src/schedule/entities';
import { User } from 'src/user/entities';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StudentClass } from './student-class.entity';

@Entity('classes')
export class Class {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'cycle_id', nullable: false })
  cycleId: number;

  @Column({ name: 'career_id', nullable: false })
  careerId: number;

  @Column({ name: 'course_id', nullable: false })
  courseId: number;

  @Column({ name: 'professor_user_id', nullable: false })
  professorUserId: number;

  @Column({
    name: 'course_professor_cycle',
    type: 'varchar',
    nullable: false,
  })
  courseProfessorCycle: string;

  @Column({ type: 'bool', default: true })
  status: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', select: false })
  createdAt: Date;

  @ManyToOne(() => Career, (career) => career.classes)
  @JoinColumn({ name: 'career_id' })
  career: Career;

  @ManyToOne(() => Cycle, (cycle) => cycle.classes)
  @JoinColumn({ name: 'cycle_id' })
  cycle: Cycle;

  @ManyToOne(() => Course, (course) => course.classes)
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @ManyToOne(() => User, (user) => user.classes)
  @JoinColumn({ name: 'professor_user_id' })
  professor: User;

  @OneToMany(() => Schedule, (schedule) => schedule.classs)
  schedules: Schedule[];

  @OneToMany(() => StudentClass, (studentClass) => studentClass.classs)
  studentsClass: StudentClass[];
}
