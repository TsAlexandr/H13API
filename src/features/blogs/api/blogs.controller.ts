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

@Controller('blogs')
export class BlogsController {
  constructor(
    protected blogsService: BlogService,
    protected blogQueryRepo: BlogQueryRepository,
    private postCUService: PostsService,
    private postsQueryRepo: PostsQueryRepository,
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
  ) {
    console.log(bqDto);
    return await this.postsQueryRepo.getPostsByBlogId(blogId, bqDto);
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
      cbDto.youtubeUrl,
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
