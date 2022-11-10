import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AuthController } from './api/auth.controller';
import { AuthService } from './application/auth.service';
import { JwtService } from '../sessions/application/jwt.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { EmailModule } from '../../emailManager/emailModule';
import { SessionsModule } from '../sessions/sessions.module';
import { CheckExistingConfirmCodeMiddleware } from '../../common/middlewares/existConfirmCode.middleware';

@Module({
  imports: [ConfigModule, UsersModule, EmailModule, SessionsModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CheckExistingConfirmCodeMiddleware).forRoutes({
      path: 'auth/registration-confirmation',
      method: RequestMethod.POST,
    });
  }
}
