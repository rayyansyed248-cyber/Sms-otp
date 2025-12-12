import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OtpController } from './otp.controller';
import { Otp } from './otp.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Otp])],
  providers: [OtpService],
  controllers: [OtpController],
})
export class OtpModule {}
