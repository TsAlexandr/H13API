import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsController } from './posts/api/posts.controller';
import { CommentsController } from './comments/api/comments.controller';
import { BlogsController } from './blogs/api/blogs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import 'dotenv/config';
import { BlogService } from './blogs/application/blog.service';
import { BlogsRepo } from "./blogs/infrastructure/blog.repository";
import { BlogsModule } from './blogs/blogs.module';
import { Blog, BlogSchema } from "./blogs/entities/blogs.schema";
import { BlogQueryRepository } from "./blogs/infrastructure/blog-query.repository";
import * as mongoose from "mongoose";

const mongoURI = process.env.mongoURI || 'mongodb://localhost:27017';

mongoose.set('toJSON', {
  virtuals: true,
  transform: (doc, converted) => {
    delete converted._id;
  }
});
@Module({
  imports: [MongooseModule.forRoot(mongoURI),
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema}])],
  controllers: [
    AppController,
    PostsController,
    CommentsController,
    BlogsController,
  ],
  providers: [AppService, BlogService, BlogQueryRepository, BlogsRepo ],
})
export class AppModule {}
