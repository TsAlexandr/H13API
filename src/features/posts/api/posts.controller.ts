import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from '../application/posts.service';
import { PostQueryDto } from '../dto/postQuery.dto';
import { PostsQueryRepository } from '../infrastructure/posts-query.repository';
import { CreatePostDto } from '../dto/createPost.dto';
import { CommentsQueryRepository } from '../../comments/infrastucture/comments-query.repository';
import { BlogQueryRepository } from '../../blogs/infrastructure/blog-query.repository';
import { BasicAuthGuard } from '../../../common/guards/basicAuth.guard';
import { BearerAuthGuard } from '../../../common/guards/bearerAuth.guard';
import { CommentsService } from '../../comments/application/comments.service';

@Controller('posts')
export class PostsController {
  constructor(
    protected postService: PostsService,
    protected postQueryRepo: PostsQueryRepository,
    protected commentsQueryRepo: CommentsQueryRepository,
    protected commentsService: CommentsService,
    private blogQueryRepo: BlogQueryRepository,
  ) {}

  @UseGuards(BearerAuthGuard)
  @Put(':postId/like-status')
  @HttpCode(204)
  async makeLike(
    @Param('postId') id: string,
    @Body('likeStatus') likeStatus: string,
  ) {
    const post = await this.postQueryRepo.findPostById(id);
    if (!post) throw new NotFoundException();

    await this.postService.makeLike(id, '', '', likeStatus);
  }

  @Get(':postId/comments')
  async getCommentByPostId(
    @Param('postId') postId: string,
    query: PostQueryDto,
  ) {
    const post = await this.postQueryRepo.findPostById(postId);
    if (!post) throw new NotFoundException();

    const comments = await this.commentsQueryRepo.getCommentsByPostId(
      '',
      postId,
      query,
    );

    return comments;
  }

  @UseGuards(BearerAuthGuard)
  @Post(':postId/comments')
  @HttpCode(201)
  async createCommentForPost(
    @Param('postId') postId: string,
    @Body('content') content: string,
  ) {
    const post = await this.postQueryRepo.findPostById(postId);
    if (!post) throw new NotFoundException();

    const comment = await this.commentsService.createComment(
      content,
      postId,
      '',
      '',
    );
    return comment;
  }

  @Get()
  async getAllPosts(@Query() pqDto: PostQueryDto) {
    const currentUserId = '';
    const data = await this.postQueryRepo.findAllPosts(
      currentUserId,
      pqDto.pageNumber,
      pqDto.pageSize,
      pqDto.sortBy,
      pqDto.sortDirection,
    );
    return data;
  }

  @UseGuards(BasicAuthGuard)
  @Post()
  async createPost(@Body() cpDto: CreatePostDto) {
    console.log(cpDto);
    const blog = await this.blogQueryRepo.findBlogById(cpDto.blogId);
    if (!blog) throw new NotFoundException();

    const post = await this.postService.createPost(cpDto, {
      id: 1,
      name: 'blog',
    });

    if (!post) throw new NotFoundException();

    return post;
  }

  @Get(':id')
  async getPostById(@Param('id') id: string) {
    const post = await this.postQueryRepo.findPostById(id);
    if (!post) throw new NotFoundException();
    return post;
  }

  @UseGuards(BasicAuthGuard)
  @Put(':id')
  @HttpCode(204)
  async updatePost(@Param('id') id: string, @Body() cpDto: CreatePostDto) {
    const isUpdated = await this.postService.updatePost(id, cpDto);
    if (!isUpdated) throw new NotFoundException();

    return true;
  }

  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async deletePost(@Param('id') id: string) {
    const isDeleted = await this.postService.deletePost(id);
    if (!isDeleted) throw new NotFoundException();

    return true;
  }
}
