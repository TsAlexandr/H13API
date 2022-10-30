import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsController } from './posts/api/posts.controller';
import { CommentsController } from './comments/api/comments.controller';
import { BlogsController } from './blogs/api/blogs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import 'dotenv/config';
import { BlogsModule } from './blogs/blogs.module';
import { PostsModule } from './posts/posts.module';
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
    BlogsModule,
    PostsModule],
  controllers: [
    AppController,
    CommentsController
  ],
  providers: [AppService],
})
export class AppModule {}
