import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ActivityType } from './activity-type.entity';
import { Class } from 'src/class/entities';

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

  @Column({ name: 'class_id', nullable: false })
  classId: number;

  @Column({ type: 'bool', default: true })
  status: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', select: false })
  createdAt: Date;

  @ManyToOne(() => ActivityType, (activityType) => activityType.activities)
  @JoinColumn({ name: 'activity_type_id' })
  activityType: ActivityType;

  @ManyToOne(() => Class, (classs) => classs.avtivities)
  @JoinColumn({ name: 'class_id' })
  classs: Class;
}
