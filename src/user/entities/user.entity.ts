import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { hash } from 'bcryptjs';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false, length: 255 })
  username: string;

  @Column({ type: 'varchar', nullable: false, select: false, length: 255 })
  password: string;

  @Column({ name: 'person_id', type: 'int', nullable: false })
  personId: number;

  @Column({ name: 'role_id', type: 'int', nullable: false })
  roleId: number;

  @Column({ type: 'bool', default: true })
  status: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (!this.password) {
      //si no se cambia la clave
      return;
    }
    this.password = await hash(this.password, 10);
  }
}
