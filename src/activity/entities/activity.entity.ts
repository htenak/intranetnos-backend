import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('activities')
export class Activity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ name: 'min_grade', type: 'float', default: 0 })
  minGrade: number;

  @Column({ name: 'max_grade', type: 'float', default: 20 })
  maxGrade: number;

  @Column({ name: 'due_date', type: 'timestamp', nullable: false })
  dueDate: Date;

  @Column({ name: 'activity_type_id', nullable: false })
  activityTypeId: number;

  @Column({ type: 'bool', default: true })
  status: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', select: false })
  createdAt: Date;
}
