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
import { AuthModule } from './features/auth/auth.module';
import { SessionsModule } from './features/sessions/sessions.module';
import { AuthService } from './features/auth/application/auth.service';
import { BlogService } from './features/blogs/application/blog.service';
import { CommentsService } from './features/comments/application/comments.service';
import { PostsService } from './features/posts/application/posts.service';
import { SessionsService } from './features/sessions/application/sessions.service';
import { BlogQueryRepository } from './features/blogs/infrastructure/blog-query.repository';
import { Blog, BlogSchema } from './features/blogs/entities/blogs.schema';

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
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    BlogsModule,
    PostsModule,
    CommentsModule,
    UsersModule,
    EmailModule,
    TestingModule,
    AuthModule,
    SessionsModule,
  ],
  controllers: [AppController],
  providers: [AppService, BlogQueryRepository],
})
export class AppModule {}
