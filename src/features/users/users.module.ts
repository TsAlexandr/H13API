import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UsersService } from './application/users.service';
import { UsersController } from './api/users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.schema';
import { UserQueryRepository } from './infrastructure/user-query.repository';
import { UserRepository } from './infrastructure/user.repository';
import { EmailModule } from '../../emailManager/emailModule';
import { CheckExistingUserMiddleware } from '../../common/middlewares/existUser.middleware';
import { CommentsService } from '../comments/application/comments.service';
import { CommentsModule } from '../comments/comments.module';
import { CommentsRepository } from '../comments/infrastucture/comments.repository';
import { CommentsQueryRepository } from '../comments/infrastucture/comments-query.repository';
import { LikesRepository } from '../comments/infrastucture/likes.repository';
import { Comment, CommentSchema } from '../comments/entities/comments.schema';
import { Like, LikeSchema } from '../comments/entities/likes.schema';

@Module({
  controllers: [UsersController],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    MongooseModule.forFeature([{ name: Like.name, schema: LikeSchema }]),
    EmailModule,
  ],
  providers: [
    UsersService,
    UserQueryRepository,
    UserRepository,
    CommentsService,
    CommentsRepository,
    CommentsQueryRepository,
    LikesRepository,
  ],
  exports: [UsersService, UserQueryRepository, UserRepository],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CheckExistingUserMiddleware)
      .forRoutes({ path: 'auth/registration', method: RequestMethod.POST });
  }
}
