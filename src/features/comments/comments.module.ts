import { Module } from '@nestjs/common';
import { CommentsService } from './application/comments.service';
import { CommentsController } from './api/comments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from './entities/comments.schema';
import { CommentsRepository } from './infrastucture/comments.repository';
import { CommentsQueryRepository } from './infrastucture/comments-query.repository';
import { LikesRepository } from './infrastucture/likes.repository';
import { Like, LikeSchema } from './entities/likes.schema';
import { UsersModule } from '../users/users.module';
import { JwtService } from '../sessions/application/jwt.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    MongooseModule.forFeature([{ name: Like.name, schema: LikeSchema }]),
    UsersModule,
  ],
  controllers: [CommentsController],
  providers: [
    CommentsService,
    CommentsRepository,
    CommentsQueryRepository,
    LikesRepository,
    JwtService,
  ],
  exports: [CommentsService, CommentsQueryRepository, LikesRepository],
})
export class CommentsModule {}
