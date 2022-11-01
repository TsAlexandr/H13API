import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogsModule } from './blogs/blogs.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { UsersModule } from './users/users.module';
import * as mongoose from "mongoose";
import { EmailModule } from "./emailManager/emailModule";

const mongoURI = "mongodb+srv://devliss:devlissadmin@incubator.pz501up.mongodb.net/ht_03?retryWrites=true&w=majority"//process.env.mongoURI || 'mongodb://localhost:27017';

mongoose.set('toJSON', {
  virtuals: true,
  transform: (doc, converted) => {
    delete converted._id;
  }
});
@Module({
  imports: [

    MongooseModule.forRoot(mongoURI),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BlogsModule,
    PostsModule,
    CommentsModule,
    UsersModule,
    EmailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
