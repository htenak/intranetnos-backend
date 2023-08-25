import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('student_class')
export class StudentClass {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'class_id', nullable: false })
  classId: number;

  @Column({ name: 'student_user_id', nullable: false })
  studentUserId: number;

  @Column({ name: 'cycle_id', nullable: false })
  cycleId: number;

  @Column({ type: 'bool', default: true })
  status: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
