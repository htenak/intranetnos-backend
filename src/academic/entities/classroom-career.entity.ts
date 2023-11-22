import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Classroom } from './classroom.entity';
import { Career } from './career.entity';
import { Class } from 'src/class/entities';

@Entity('classrooms_careers')
export class ClassroomCareer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'classroom_id', nullable: false })
  classroomId: number;

  @Column({ name: 'career_id', nullable: false })
  careerId: number;

  @Column({ type: 'varchar', nullable: false })
  denomination: string;

  @Column({ type: 'bool', default: true })
  status: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', select: false })
  createdAt: Date;

  @ManyToOne(() => Classroom, (classroom) => classroom.classroomsCareer)
  @JoinColumn({ name: 'classroom_id' })
  classroom: Classroom;

  @ManyToOne(() => Career, (career) => career)
  @JoinColumn({ name: 'career_id' })
  career: Career;

  @OneToMany(() => Class, (classs) => classs.classroomCareer)
  classes: Class[];
}
