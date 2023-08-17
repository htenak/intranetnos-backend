import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('persons')
export class Person {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false, length: 255 })
  name: string;

  @Column({ name: 'last_name1', type: 'varchar', nullable: false, length: 255 })
  lastName1: string;

  @Column({ name: 'last_name2', type: 'varchar', nullable: false, length: 255 })
  lastName2: string;

  @Column({ unique: true, type: 'varchar', nullable: false, length: 8 })
  dni: string;

  @Column({ unique: true, type: 'varchar', nullable: false, length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 9 })
  phone: string;

  @Column({ type: 'bool', default: true })
  status: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createAt: Date;
}
