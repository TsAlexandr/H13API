import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BlogQueryRepository } from '../infrastructure/blog-query.repository';
import { BlogService } from '../application/blog.service';
import { BlogQueryDto } from '../dto/blogQuery.dto';
import { CreateBlogDto } from '../dto/createBlog.dto';
import { PostsService } from '../../posts/application/posts.service';
import { PostsQueryRepository } from '../../posts/infrastructure/posts-query.repository';
import { CreatePostByIdDto } from '../dto/createPostById.dto';
import { BasicAuthGuard } from '../../../common/guards/basicAuth.guard';
import { Request } from 'express';
import mongoose from 'mongoose';
import { JwtService } from '../../sessions/application/jwt.service';
import { UserQueryRepository } from '../../users/infrastructure/user-query.repository';

@Controller('blogs')
export class BlogsController {
  constructor(
    protected blogsService: BlogService,
    protected blogQueryRepo: BlogQueryRepository,
    private postCUService: PostsService,
    private postsQueryRepo: PostsQueryRepository,
    private jwtService: JwtService,
    private userQueryRepo: UserQueryRepository,
  ) {}

  @UseGuards(BasicAuthGuard)
  @Post()
  async createBlog(@Body() cbDto: CreateBlogDto) {
    return await this.blogsService.createBlog(cbDto);
  }

  @Get()
  async getAllBlogs(@Query() bqDto: BlogQueryDto) {
    const data = await this.blogQueryRepo.findAllBlogs(bqDto);
    return data;
  }

  @Get('/:blogId/posts')
  async getAllPostsByBlogId(
    @Param('blogId') blogId: string,
    @Query() bqDto: BlogQueryDto,
    @Req() req: Request,
  ) {
    let currentUserId = new mongoose.Types.ObjectId();
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1];
      console.log(token);
      const userId = await this.jwtService.getUserByAccessToken(token);
      console.log('UserId = ' + userId);

      if (userId) {
        const user = await this.userQueryRepo.findById(userId.toString());
        if (user) {
          currentUserId = user.id;
        }
      }
    }
    console.log(bqDto);
    return await this.postsQueryRepo.getPostsByBlogId(
      blogId,
      bqDto,
      currentUserId,
    );
  }

  @UseGuards(BasicAuthGuard)
  @Post('/:blogId/posts')
  async createPostByBlogId(
    @Param('blogId') blogId: string,
    @Body() cpDto: CreatePostByIdDto,
  ) {
    const blog = await this.blogQueryRepo.findBlogById(blogId);
    if (!blog) throw new NotFoundException();

    const post = await this.postCUService.createPost(cpDto, blog);
    return post;
  }

  @Get('/:id')
  async getBlogById(@Param('id') id: string) {
    const blog = await this.blogQueryRepo.findBlogById(id);
    console.log(blog);
    if (!blog) throw new NotFoundException();
    return blog;
  }

  @UseGuards(BasicAuthGuard)
  @Put('/:id')
  @HttpCode(204)
  async updateBlog(@Param('id') id: string, @Body() cbDto: CreateBlogDto) {
    const isUpdated = await this.blogsService.updateBlog(
      id,
      cbDto.name,
      cbDto.websiteUrl,
        cbDto.description
    );
    if (!isUpdated) throw new NotFoundException();
    return true;
  }

  @UseGuards(BasicAuthGuard)
  @Delete('/:id')
  @HttpCode(204)
  async deleteBlog(@Param('id') id: string) {
    const isDeleted = await this.blogsService.deleteBlog(id);
    if (!isDeleted) throw new NotFoundException();
  }
}
