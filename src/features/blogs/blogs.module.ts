import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './entities/blogs.schema';
import { BlogsController } from './api/blogs.controller';
import { BlogService } from './application/blog.service';
import { BlogsRepo } from './infrastructure/blog.repository';
import { BlogQueryRepository } from './infrastructure/blog-query.repository';
import { PostsModule } from '../posts/posts.module';
import { CheckExistingBlogMiddleware } from '../../common/middlewares/blogId.middleware';
import { JwtService } from '../sessions/application/jwt.service';
import { UserQueryRepository } from '../users/infrastructure/user-query.repository';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    PostsModule,
    UsersModule,
  ],
  controllers: [BlogsController],
  providers: [BlogService, BlogsRepo, BlogQueryRepository, JwtService],
  exports: [BlogService, BlogsRepo],
})
export class BlogsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CheckExistingBlogMiddleware)
      .forRoutes(
        { path: 'blogs/:blogId/posts', method: RequestMethod.POST },
        { path: 'blogs/:blogId/posts', method: RequestMethod.GET },
      );
  }
}
