import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CourseType } from './course-type.entity';
import { Career } from './career.entity';
import { Class } from 'src/class/entities';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true, nullable: false, length: 255 })
  name: string;

  @Column({ type: 'varchar', unique: true, nullable: false, length: 50 })
  abbreviation: string;

  @Column({ name: 'course_type_id', nullable: false })
  courseTypeId: number;

  @Column({ name: 'career_id', nullable: true })
  careerId: number;

  @Column({ type: 'bool', default: true })
  status: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', select: false })
  createdAt: Date;

  @ManyToOne(() => CourseType, (courseType) => courseType.courses)
  @JoinColumn({ name: 'course_type_id' })
  courseType: CourseType;

  @ManyToOne(() => Career, (career) => career.courses)
  @JoinColumn({ name: 'career_id' })
  career: Career;

  @OneToMany(() => Class, (classs) => classs.course)
  classes: Class[];
}
