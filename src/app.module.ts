import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsController } from './posts/api/posts.controller';
import { CommentsController } from './comments/api/comments.controller';
import { BlogsController } from './blogs/api/blogs.controller';
import {MongooseModule} from "@nestjs/mongoose";
import "dotenv/config";
import {BlogService} from "./blogs/application/blog.service";

const mongoURI = process.env.mongoURI || "mongodb://localhost:27017";

@Module({
  imports: [MongooseModule.forRoot(mongoURI)],
  controllers: [AppController,PostsController, CommentsController, BlogsController],
  providers: [AppService, BlogService],
})
export class AppModule {}
