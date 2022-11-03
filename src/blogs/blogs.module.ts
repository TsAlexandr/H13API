import {forwardRef, MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './entities/blogs.schema';
import { BlogsController } from './api/blogs.controller';
import { BlogService } from './application/blog.service';
import { BlogsRepo } from './infrastructure/blog.repository';
import { BlogQueryRepository } from './infrastructure/blog-query.repository';
import { PostCreateUpdateService } from './application/post-create-update/post-create-update.service';
import { PostsModule } from '../posts/posts.module';
import {CheckExistingBlogMiddleware} from "../middlewares/blogId.middleware";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    forwardRef(() => PostsModule),
  ],
  controllers: [BlogsController],
  providers: [BlogService, BlogsRepo, BlogQueryRepository],
  exports: [BlogService],
})
export class BlogsModule{
  configure(consumer: MiddlewareConsumer) {
    consumer
        .apply(CheckExistingBlogMiddleware)
        .forRoutes({ path: 'blogs/:blogId/posts', method: RequestMethod.POST });
  }
}
