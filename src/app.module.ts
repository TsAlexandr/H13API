import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogsModule } from './blogs/blogs.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { UsersModule } from './users/users.module';
import * as mongoose from 'mongoose';
import { EmailModule } from './emailManager/emailModule';
import { TestingController } from './testing/testing.controller';
import { TestingModule } from './testing/testing.module';

mongoose.set('toJSON', {
  virtuals: true,
  transform: (doc, converted) => {
    delete converted._id;
  },
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.mongoURI),
    BlogsModule,
    PostsModule,
    CommentsModule,
    UsersModule,
    EmailModule,
    TestingModule,
  ],
  controllers: [AppController, TestingController],
  providers: [AppService],
})
export class AppModule {}
