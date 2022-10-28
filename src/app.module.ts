import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersControllerController } from './users-controller/users-controller.controller';
import { UsersController } from './users/api/users.controller';
import { PostsController } from './posts/api/posts.controller';
import { CommentsController } from './comments/api/comments.controller';
import { BlogsController } from './blogs/api/blogs.controller';

@Module({
  imports: [],
  controllers: [AppController, UsersControllerController, UsersController, PostsController, CommentsController, BlogsController],
  providers: [AppService],
})
export class AppModule {}
