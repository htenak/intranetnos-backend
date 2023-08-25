import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('classes')
export class Class {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'cycle_id', nullable: false })
  cycleId: number;

  @Column({ name: 'course_id', nullable: false })
  courseId: number;

  @Column({ name: 'professor_user_id', nullable: false })
  professorUserId: number;

  @Column({
    name: 'course_professor_career_cycle',
    type: 'varchar',
    nullable: false,
  })
  courseProfessorCareerCycle: string;

  @Column({ type: 'bool', default: true })
  status: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
