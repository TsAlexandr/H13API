import { Module } from '@nestjs/common';
import { PostsController } from './api/posts.controller';
import { PostsService } from './application/posts.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './entities/posts.schema';
import { PostsRepository } from './infrastructure/posts.repository';
import { PostsQueryRepository } from './infrastructure/posts-query.repository';
import { CommentsModule } from '../comments/comments.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    CommentsModule,
  ],
  controllers: [PostsController],
  providers: [PostsService, PostsQueryRepository, PostsRepository],
  exports: [PostsService],
})
export class PostsModule {}
