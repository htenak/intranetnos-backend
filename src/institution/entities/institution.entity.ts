import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('institution')
export class Institution {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 9 })
  phone: string;

  @Column({ type: 'varchar' })
  cellphone: string;

  @Column({ type: 'varchar' })
  address: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar' })
  website: string;

  @Column({ type: 'text' })
  logo: string;

  @Column({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
