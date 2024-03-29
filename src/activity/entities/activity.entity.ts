import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ActivityType } from './activity-type.entity';
import { Class } from 'src/class/entities';
import { User } from 'src/user/entities';
import { ActivityComment } from 'src/activity-comments/entities';
import { Grade } from 'src/grade/entities';

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

  @Column({ name: 'professor_user_id', nullable: false })
  professorUserId: number;

  @Column({ type: 'bool', default: true })
  status: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(() => ActivityType, (activityType) => activityType.activities)
  @JoinColumn({ name: 'activity_type_id' })
  activityType: ActivityType;

  @ManyToOne(() => Class, (classs) => classs.avtivities)
  @JoinColumn({ name: 'class_id' })
  classs: Class;

  @ManyToOne(() => User, (user) => user.activities)
  @JoinColumn({ name: 'professor_user_id' })
  professor: User;

  @OneToMany(
    () => ActivityComment,
    (activityComment) => activityComment.activity,
  )
  activityComments: ActivityComment[];

  @OneToMany(() => Grade, (grade) => grade.activity)
  grades: Grade[];
}
