import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  description: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createAt: Date;
}
