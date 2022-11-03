import { Controller, Delete, Get } from "@nestjs/common";
import { BlogService } from '../blogs/application/blog.service';
import { PostsService } from '../posts/application/posts.service';
import { CommentsService } from '../comments/application/comments.service';
import { UsersService } from '../users/application/users.service';

@Controller('testing')
export class TestingController {
  constructor(
    private blogService: BlogService,
    private postService: PostsService,
    private commentsService: CommentsService,
    private usersService: UsersService,
  ) {}

  @Delete('all-data')
  async deleteAllData() {
    await this.blogService.deleteAllBlogs();
    await this.postService.deleteAllPosts();
    await this.commentsService.deleteAllComments();
    await this.usersService.deleteAll();
  }
}
