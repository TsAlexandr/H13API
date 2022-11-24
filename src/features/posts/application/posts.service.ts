import { PostsRepository } from '../infrastructure/posts.repository';
import { Injectable } from '@nestjs/common';
import { CreatePostByIdDto } from '../../blogs/dto/createPostById.dto';
import { CreatePostDto } from '../dto/createPost.dto';
import { LikesRepository } from '../../comments/infrastucture/likes.repository';
import * as mongoose from 'mongoose';
@Injectable()
export class PostsService {
  constructor(
    protected postRepo: PostsRepository,
    private likeRepo: LikesRepository,
  ) {}

  async deletePost(id: string) {
    return this.postRepo.deletePost(id);
  }
  //TODO:исправить тип для блога
  async createPost(cpDto: CreatePostDto, blog: string) {
    const post: any = {
      title: cpDto.title,
      shortDescription: cpDto.shortDescription,
      content: cpDto.content,
      blogId: cpDto.blogId,
      blogName: blog,
      createdAt: new Date().toISOString(),
    };

    const createdPost = await this.postRepo.createPost(post);
    return createdPost;
  }
  async updatePost(id: string, cpDto: CreatePostDto) {
    return this.postRepo.updatePost(id, cpDto);
  }
  async deleteAllPosts() {
    return await this.postRepo.deleteAll();
  }
  async makeLike(postId: string, user: any, status: string) {
    console.log('Make like for post! -->', postId);
    console.log(status);
    const postIdDb = postId;
    console.log('USERID');
    console.log(user);
    const addedAt = new Date().toISOString();
    const existedLike = await this.likeRepo.getLikeByPostIdAndUserId(
      postId,
      user.id,
    );
    console.log(existedLike);
    const likeInfo: {
      postId: mongoose.Types.ObjectId;
      userId: mongoose.Types.ObjectId;
      login: string;
      isBanned: boolean;
      addedAt: string;
      status: string;
    } = {
      postId: new mongoose.Types.ObjectId(postId),
      userId: new mongoose.Types.ObjectId(user.id),
      login: user.login,
      addedAt,
      status,
      isBanned: user.banInfo.isBanned,
    };
    console.log(likeInfo);
    let like = null;
    if (existedLike) {
      like = await this.likeRepo.updatePostLike(likeInfo);
    } else {
      like = await this.likeRepo.createPostLike(likeInfo);
    }
    return like;
  }
}
