import { Module } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";
import { Blog, BlogSchema } from "./entities/blogs.schema";
import { BlogsController } from "./api/blogs.controller";
import { BlogService } from "./application/blog.service";
import { BlogsRepo } from "./infrastructure/blog.repository";
import { BlogQueryRepository } from "./infrastructure/blog-query.repository";
import { PostsService } from "../posts/application/posts.service";
import { PostsModule } from "../posts/posts.module";

@Module({
  imports:[MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema}]), PostsModule],
  controllers: [BlogsController],
  providers: [BlogService, BlogsRepo, BlogQueryRepository]
})
export class BlogsModule {
}
