import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Otp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  phoneNumber: string; // e.g., '+919876543210'

  @Column()
  otp: string; // 6-digit code as string

  @Column()
  expiresAt: Date; // When OTP expires (e.g., 5 minutes from now)
}
