import {
  BadRequestException,
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
import { PostsService } from '../application/posts.service';
import { PostQueryDto } from '../dto/postQuery.dto';
import { PostsQueryRepository } from '../infrastructure/posts-query.repository';
import { CreatePostDto } from '../dto/createPost.dto';
import { CommentsQueryRepository } from '../../comments/infrastucture/comments-query.repository';
import { BlogQueryRepository } from '../../blogs/infrastructure/blog-query.repository';
import { BasicAuthGuard } from '../../../common/guards/basicAuth.guard';
import { BearerAuthGuard } from '../../../common/guards/bearerAuth.guard';
import { CommentsService } from '../../comments/application/comments.service';
import { User } from '../../../common/decorators/user.decorator';
import { UpdateCommentDto } from '../../comments/dto/updateComment.dto';
import { LikeStatusDto } from '../../comments/dto/likeStatus.dto';
import { Request } from 'express';
import * as mongoose from 'mongoose';
import { JwtService } from '../../sessions/application/jwt.service';
import { UsersService } from '../../users/application/users.service';
import { UserQueryRepository } from '../../users/infrastructure/user-query.repository';

@Controller('posts')
export class PostsController {
  constructor(
    private postService: PostsService,
    private postQueryRepo: PostsQueryRepository,
    private commentsQueryRepo: CommentsQueryRepository,
    private commentService: CommentsService,
    private blogQueryRepo: BlogQueryRepository,
    private jwtService: JwtService,
    private userQueryRepo: UserQueryRepository,
  ) {}


  @Put(':postId/like-status')
  @HttpCode(204)
  async makeLike(
    @Param('postId') id: string,
    @Body() lsDto: LikeStatusDto,
    @User() user,
  ) {
    const post = await this.postQueryRepo.getPostById(id);
    if (!post) throw new NotFoundException();

    await this.postService.makeLike(id, user, lsDto.likeStatus);
  }

  @Get(':postId/comments')
  async getCommentByPostId(
    @Param('postId') postId: string,
    @Query() query: PostQueryDto,
    @Req() req: Request,
  ) {
    const post = await this.postQueryRepo.getPostById(postId);
    if (!post) throw new NotFoundException();

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
    const comments = await this.commentsQueryRepo.getCommentsByPostId(
      currentUserId,
      postId,
      query,
    );
    return comments;
  }


  @Post(':postId/comments')
  @HttpCode(201)
  async createComment(
    @Param('postId') postId: string,
    //TODO: повесить проверку на поле content
    @Body() ucDto: UpdateCommentDto,
    //TODO: изменить тип переменной
    @User() user: any,
    @Req() req: Request,
  ) {
    const post = await this.postQueryRepo.getPostById(postId);
    console.log(post);
    console.log(user);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    console.log(req.user);
    if (!post) throw new NotFoundException();

    const comment = await this.commentService.createComment(
      ucDto.content,
      postId,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      req.user,
    );

    return comment;
  }

  @Get()
  async getAllPosts(@Query() pqDto: PostQueryDto, @Req() req: Request) {
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

    const data = await this.postQueryRepo.findAllPosts(
      currentUserId,
      pqDto.pageNumber,
      pqDto.pageSize,
      pqDto.sortBy,
      pqDto.sortDirection,
    );
    return data;
  }


  @Post()
  async createPost(@Body() cpDto: CreatePostDto) {
    console.log(cpDto);
    const blog = await this.blogQueryRepo.findBlogById(cpDto.blogId);
    if (!blog) throw new NotFoundException();

    const post = await this.postService.createPost(cpDto, blog.name);

    if (!post) throw new NotFoundException();

    return post;
  }

  @Get(':id')
  async getPostById(@Param('id') id: string, @Req() req: Request) {
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

    const post = await this.postQueryRepo.findPostById(id, currentUserId);
    if (!post) throw new NotFoundException();
    return post;
  }


  @Put(':id')
  @HttpCode(204)
  async updatePost(@Param('id') id: string, @Body() cpDto: CreatePostDto) {
    const blog = await this.blogQueryRepo.findBlogById(cpDto.blogId);

    if (!blog)
      throw new BadRequestException([
        { message: "Blod doesn't exist", field: 'blogId' },
      ]);
    const isUpdated = await this.postService.updatePost(id, cpDto);
    if (!isUpdated)
      throw new NotFoundException({
        message: "Blod doesn't exist",
        field: 'blogId',
      });

    return true;
  }


  @Delete(':id')
  @HttpCode(204)
  async deletePost(@Param('id') id: string) {
    const isDeleted = await this.postService.deletePost(id);
    if (!isDeleted) throw new NotFoundException();

    return true;
  }
}
