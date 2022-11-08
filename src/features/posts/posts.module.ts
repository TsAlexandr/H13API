import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  RequestMethod,
} from '@nestjs/common';
import { PostsController } from './api/posts.controller';
import { PostsService } from './application/posts.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './entities/posts.schema';
import { PostsRepository } from './infrastructure/posts.repository';
import { PostsQueryRepository } from './infrastructure/posts-query.repository';
import { CommentsModule } from '../comments/comments.module';
import { CheckExistingBlogForPostMiddleware } from '../../common/middlewares/blogIdInBody.middleware';
import { BlogsModule } from '../blogs/blogs.module';
import { BlogQueryRepository } from '../blogs/infrastructure/blog-query.repository';
import { Blog, BlogSchema } from '../blogs/entities/blogs.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    CommentsModule,
  ],
  controllers: [PostsController],
  providers: [
    PostsService,
    PostsQueryRepository,
    PostsRepository,
    BlogQueryRepository,
  ],
  exports: [PostsService, PostsQueryRepository, PostsRepository],
})
export class PostsModule {
  /*configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CheckExistingBlogForPostMiddleware)
      .forRoutes({ path: 'posts', method: RequestMethod.POST });
  }*/
}
