import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { EmailModule } from './emailManager/emailModule';
import { BlogsModule } from './features/blogs/blogs.module';
import { PostsModule } from './features/posts/posts.module';
import { CommentsModule } from './features/comments/comments.module';
import { UsersModule } from './features/users/users.module';
import { TestingModule } from './features/testing/testing.module';

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
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
