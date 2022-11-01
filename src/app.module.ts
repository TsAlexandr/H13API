import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogsModule } from './blogs/blogs.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { UsersModule } from './users/users.module';
import * as mongoose from "mongoose";
import { EmailModule } from "./emailManager/emailModule";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { PostsController } from "./posts/api/posts.controller";
import { CommentsController } from "./comments/api/comments.controller";
import { UsersController } from "./users/api/users.controller";
import { BlogsController } from "./blogs/api/blogs.controller";

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
      envFilePath: ".env",
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
