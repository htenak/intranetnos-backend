import { User } from 'src/user/entities';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Activity } from './activity.entity';

@Entity('activities_type')
export class ActivityType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  description: string;

  @Column({ name: 'professor_user_id', nullable: false })
  professorUserId: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', select: false })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.activitiesType)
  @JoinColumn({ name: 'professor_user_id' })
  professor: User;

  @OneToMany(() => Activity, (activity) => activity.activityType)
  activities: Activity[];
}
