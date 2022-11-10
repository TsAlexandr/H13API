import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UsersService } from './application/users.service';
import { UsersController } from './api/users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.schema';
import { UserQueryRepository } from './infrastructure/user-query.repository';
import { UserRepository } from './infrastructure/user.repository';
import { EmailModule } from '../../emailManager/emailModule';
import { CheckExistingUserMiddleware } from '../../common/middlewares/existUser.middleware';

@Module({
  controllers: [UsersController],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    EmailModule,
  ],
  providers: [UsersService, UserQueryRepository, UserRepository],
  exports: [UsersService, UserQueryRepository, UserRepository],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CheckExistingUserMiddleware)
      .forRoutes({ path: 'posts/registration', method: RequestMethod.POST });
  }
}
