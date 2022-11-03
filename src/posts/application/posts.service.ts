import { PostsRepository } from '../infrastructure/posts.repository';
import { Injectable } from '@nestjs/common';
@Injectable()
export class PostsService {
  constructor(protected postRepo: PostsRepository) {}
  async deletePost(id: string) {
    return this.postRepo.deletePost(id);
  }

  async createPost(
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
  ) {
    const post: any = {
      title: title,
      shortDescription: shortDescription,
      content: content,
      blogId: blogId,
      blogName: blogName,
      createdAt: new Date().toISOString(),
    };

    const createdPost = await this.postRepo.createPost(post);
    return createdPost;
  }
  async updatePost(
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
  ) {
    return this.postRepo.updatePost(
      id,
      title,
      shortDescription,
      content,
      blogId,
    );
  }
  async deleteAllPosts() {
    return await this.postRepo.deleteAll();
  }
  /*async makeLike(postId:string, userId:ObjectId, userLogin:string, status:string){
    console.log("Make like for post! -->", postId)
    console.log(status)
    const postIdDb = new ObjectId(postId)
    console.log("USERID")
    console.log(userId)
    const addedAt = new Date().toISOString()
    const existedLike = await this.likesDbRepo.getLikeByPostIdAndUserId(postId,userId)
    const likeInfo:{postId:ObjectId, userId:ObjectId, login:string, addedAt: string,status:string} = {
      postId:postIdDb,
      userId,
      login:userLogin,
      addedAt,
      status,
    }
    console.log(likeInfo)
    let like = null;
    if(existedLike){
      like = await this.likesDbRepo.updatePostLike(likeInfo)
    }
    else{
      like = await this.likesDbRepo.createPostLike(likeInfo);
    }
    return like;
  }*/
}
