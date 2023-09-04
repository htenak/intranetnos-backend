import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { hash } from 'bcryptjs';
import { Role } from './role.entity';
import { Class, StudentClass } from 'src/class/entities';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ name: 'last_name1', type: 'varchar' })
  lastName1: string;

  @Column({ name: 'last_name2', type: 'varchar' })
  lastName2: string;

  @Column({ unique: true, type: 'varchar', length: 8 })
  dni: string;

  @Column({ unique: true, type: 'varchar', nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 9 })
  phone: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  nickname: string;

  @Column({ type: 'varchar', nullable: false, length: 8, unique: true })
  username: string;

  @Column({ type: 'varchar', nullable: false, select: false, length: 255 })
  password: string;

  @Column({ type: 'varchar', nullable: true })
  filename: string;

  @Column({ name: 'role_id', nullable: false })
  roleId: number;

  @Column({ type: 'bool', default: true })
  status: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', select: false })
  createdAt: Date;

  @ManyToOne(() => Role, (role) => role.user) // role.user porque es la propiedad de @OneToMany() en Role
  @JoinColumn({ name: 'role_id' }) //especifica columna con la que se hace relacion
  role: Role;

  @OneToMany(() => Class, (classs) => classs.professor)
  classes: Class[];

  @OneToMany(() => StudentClass, (studentClass) => studentClass.student)
  studentsClass: StudentClass[];

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
