import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OtpModule } from './otp/otp.module';
import { Otp } from './otp/otp.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes environment variables available globally
    }),
    TypeOrmModule.forRoot({
      type: 'postgres', // Database type
      host: process.env.DB_HOST, // e.g., localhost
      port: +(process.env.DB_PORT ?? 5433), // e.g., 5432 (cast to number, default to 5432 if undefined)
      username: process.env.DB_USERNAME, // Your PostgreSQL username
      password: process.env.DB_PASSWORD, // Your PostgreSQL password
      database: process.env.DB_NAME, // e.g., otp_app
      entities: [Otp], // Register the Otp entity
      synchronize: true, // Auto-create tables (use only in development)
    }),
    OtpModule, // Import the OTP module
  ],
  controllers: [AppController], // Default controller
  providers: [AppService], // Default service
})
export class AppModule {}
