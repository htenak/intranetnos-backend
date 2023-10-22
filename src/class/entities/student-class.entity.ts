import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Class } from './class.entity';
import { User } from 'src/user/entities';

@Entity('student_class')
export class StudentClass {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'class_id', nullable: false })
  classId: number;

  @Column({ name: 'student_user_id', nullable: false })
  studentUserId: number;

  // @Column({ name: 'cycle_id', nullable: false })
  // cycleId: number;

  @Column({ type: 'bool', default: true })
  status: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', select: true })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.studentsClass)
  @JoinColumn({ name: 'student_user_id' })
  student: User;

  @ManyToOne(() => Class, (classs) => classs.studentsClass)
  @JoinColumn({ name: 'class_id' })
  classs: Class;
}
