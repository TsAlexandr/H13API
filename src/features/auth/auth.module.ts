import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AuthController } from './api/auth.controller';
import { AuthService } from './application/auth.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { EmailModule } from '../../emailManager/emailModule';
import { SessionsModule } from '../sessions/sessions.module';
import { CheckExistingConfirmCodeMiddleware } from '../../common/middlewares/existConfirmCode.middleware';
import { CheckExistingUserMiddleware } from '../../common/middlewares/existUser.middleware';
import { ConfirmCodeValidator } from '../../common/validators/confirmCode.validator';

@Module({
  imports: [ConfigModule, UsersModule, EmailModule, SessionsModule],
  controllers: [AuthController],
  providers: [AuthService, ConfirmCodeValidator],
  exports: [AuthService],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CheckExistingUserMiddleware).forRoutes({
      path: 'auth/registration',
      method: RequestMethod.POST,
    });
  }
}
