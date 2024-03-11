import { Activity } from 'src/activity/entities';
import { User } from 'src/user/entities';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('activity_comments')
export class ActivityComment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: false })
  comment: string;

  @Column({ name: 'activity_id', nullable: false })
  activityId: number;

  @Column({ name: 'user_id', nullable: false })
  userId: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(() => Activity, (activity) => activity.activityComments)
  @JoinColumn({ name: 'activity_id' })
  activity: Activity;

  @ManyToOne(() => User, (user) => user.activityComments)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
