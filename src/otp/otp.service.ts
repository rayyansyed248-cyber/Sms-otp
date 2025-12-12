import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Otp } from './otp.entity';
import { Repository } from 'typeorm';
import twilio from 'twilio';

@Injectable()
export class OtpService {
  private client: twilio.Twilio;

  constructor(@InjectRepository(Otp) private otpRepository: Repository<Otp>) {
    this.client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN,
    );
  }

  async generateandSaveOtp(
    phone: string,
  ): Promise<{ otp: string; sent: boolean }> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

    await this.otpRepository.delete({ phoneNumber: phone }); // Remove old OTPs for this number

    await this.otpRepository.save({ phoneNumber: phone, otp, expiresAt });

    try {
      await this.client.messages.create({
        body: `Your OTP is ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone,
      });

      return { otp, sent: true };
    } catch (error) {
      console.error('Error sending OTP via SMS:', error);
      await this.otpRepository.delete({ phoneNumber: phone }); // Cleanup on failure
      return { otp, sent: false };
    }
  }

  async verifyOtp(phone: string, inputOtp: string): Promise<boolean> {
    const record = await this.otpRepository.findOne({
      where: { phoneNumber: phone },
    });

    if (!record || record.otp !== inputOtp || record.expiresAt < new Date()) {
      return false;
    }

    await this.otpRepository.delete({ phoneNumber: phone }); // OTP can be used only once
    return true;
  }
}
