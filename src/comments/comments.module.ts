import { Module } from '@nestjs/common';
import { CommentsService } from './application/comments.service';
import { CommentsController } from "./api/comments.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Comment, CommentSchema } from "./entities/comments.schema";
import { CommentsRepository } from "./infrastucture/comments.repository";
import { CommentsQueryRepository } from "./infrastucture/comments-query.repository";

@Module({
  imports:[MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema}])],
  controllers:[CommentsController],
  providers: [CommentsService, CommentsRepository, CommentsQueryRepository],
  exports:[CommentsService, CommentsQueryRepository]
})
export class CommentsModule {}
