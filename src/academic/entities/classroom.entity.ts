import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ClassroomCareer } from './classroom-career.entity';

@Entity('classrooms')
export class Classroom {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', unique: true, nullable: false })
  number: number;

  @Column({ type: 'varchar', unique: true, nullable: true })
  description: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', select: false })
  createdAt: Date;

  @OneToMany(
    () => ClassroomCareer,
    (classroomCareer) => classroomCareer.classroom,
  )
  classroomsCareer: ClassroomCareer[];
}
