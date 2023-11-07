import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Course } from './course.entity';
import { Class } from 'src/class/entities';
import { ClassroomCareer } from './classroom-career.entity';

@Entity('careers')
export class Career {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true, nullable: false, length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', select: false })
  createdAt: Date;

  @OneToMany(() => Course, (course) => course.career)
  courses: Course[];

  @OneToMany(() => Class, (classs) => classs.career)
  classes: Class[];

  @OneToMany(() => ClassroomCareer, (classroomCareer) => classroomCareer.career)
  classroomsCareer: ClassroomCareer[];
}
