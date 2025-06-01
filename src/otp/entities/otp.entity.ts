import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('otps')
export class Otp {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ unique: true })
  email: string;

  @Column()
  code: number;
}
