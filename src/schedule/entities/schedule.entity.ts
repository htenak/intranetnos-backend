import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'start_time', type: 'varchar', length: 255, nullable: false })
  startTime: string;

  @Column({ name: 'end_time', type: 'varchar', length: 255, nullable: false })
  endTime: string;

  @Column({ name: 'day_id', nullable: false })
  dayId: number;

  @Column({ name: 'class_id', nullable: false })
  classId: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
