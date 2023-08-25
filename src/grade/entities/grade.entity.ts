import {
  Column,
  CreateDateColumn,
  Entity,
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

  @Column({ type: 'bool', default: false }) // desaprobado / aprobado
  status: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
