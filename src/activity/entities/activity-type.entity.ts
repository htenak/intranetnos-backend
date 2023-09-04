import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('activities_type')
export class ActivityType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true, length: 255, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  description: string;

  @Column({ name: 'professor_user_id', nullable: false })
  professorUserId: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', select: false })
  createdAt: Date;
}
