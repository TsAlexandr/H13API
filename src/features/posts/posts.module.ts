import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { PostsController } from './api/posts.controller';
import { PostsService } from './application/posts.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './entities/posts.schema';
import { PostsRepository } from './infrastructure/posts.repository';
import { PostsQueryRepository } from './infrastructure/posts-query.repository';
import { CommentsModule } from '../comments/comments.module';
import { CheckExistingPostMiddleware } from '../../common/middlewares/existingPost.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    CommentsModule,
  ],
  controllers: [PostsController],
  providers: [PostsService, PostsQueryRepository, PostsRepository],
  exports: [PostsService, PostsQueryRepository, PostsRepository],
})
export class PostsModule {
  /*configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CheckExistingPostMiddleware)
      .forRoutes(
        { path: 'posts/:id', method: RequestMethod.POST },
        { path: 'posts/:id', method: RequestMethod.DELETE },
      );
  }*/
}
