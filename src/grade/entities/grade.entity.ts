import { Activity } from 'src/activity/entities';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('grades')
export class Grade {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float', nullable: false })
  grade: number;

  @Column({ name: 'activity_id', nullable: false })
  activityId: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(() => Activity, (activity) => activity.grades)
  @JoinColumn({ name: 'activity_id' })
  activity: Activity;
}
