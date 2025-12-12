import { Body, Controller, Post } from '@nestjs/common';
import { OtpService } from './otp.service';

@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post('send')
  async sendOtp(@Body('phone') phone: string) {
    const result = await this.otpService.generateandSaveOtp(phone);

    return {
      success: result.sent,
      message: result.sent ? 'OTP sent' : 'Failed to send OTP',
    };
  }

  @Post('verify')
  async verifyOtp(@Body('phone') phone: string, @Body('otp') otp: string) {
    const isValid = await this.otpService.verifyOtp(phone, otp);
    return {
      valid: isValid,
      message: isValid ? 'OTP verified' : 'Invalid or expired OTP',
    };
  }
}
