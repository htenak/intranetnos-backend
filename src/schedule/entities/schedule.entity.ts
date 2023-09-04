import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Day } from './day.entity';
import { Class } from 'src/class/entities';

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

  @Column({ type: 'bool', default: true })
  status: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', select: false })
  createdAt: Date;

  @ManyToOne(() => Day, (day) => day.schedules)
  @JoinColumn({ name: 'day_id' })
  day: Day;

  @ManyToOne(() => Class, (classs) => classs.schedules)
  @JoinColumn({ name: 'class_id' })
  classs: Class;
}
