import { Module } from '@nestjs/common';
import { AuthController } from './api/auth.controller';
import { AuthService } from './application/auth.service';
import { JwtService } from '../sessions/application/jwt.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { EmailModule } from '../../emailManager/emailModule';
import { SessionsModule } from '../sessions/sessions.module';

@Module({
  imports: [ConfigModule, UsersModule, EmailModule, SessionsModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
