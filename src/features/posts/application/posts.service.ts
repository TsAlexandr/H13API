import { PostsRepository } from '../infrastructure/posts.repository';
import { Injectable } from '@nestjs/common';
import { CreatePostByIdDto } from '../../blogs/dto/createPostById.dto';
import { CreatePostDto } from '../dto/createPost.dto';
import { LikesRepository } from '../../comments/infrastucture/likes.repository';
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
  async createPost(cpDto: CreatePostByIdDto, blog: any) {
    const post: any = {
      title: cpDto.title,
      shortDescription: cpDto.shortDescription,
      content: cpDto.content,
      blogId: blog.id,
      blogName: blog.name,
      createdAt: new Date().toISOString(),
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        newestLikes: [],
      },
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
  async makeLike(
    postId: string,
    userId: string,
    userLogin: string,
    status: string,
  ) {
    console.log('Make like for post! -->', postId);
    console.log(status);
    const postIdDb = postId;
    console.log('USERID');
    console.log(userId);
    const addedAt = new Date().toISOString();
    const existedLike = await this.likeRepo.getLikeByPostIdAndUserId(
      postId,
      userId,
    );
    const likeInfo: {
      postId: string;
      userId: string;
      login: string;
      addedAt: string;
      status: string;
    } = {
      postId: postIdDb,
      userId,
      login: userLogin,
      addedAt,
      status,
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
