import { Injectable } from '@nestjs/common';
import { CommentsRepository } from '../infrastucture/comments.repository';
import { CommentsQueryRepository } from '../infrastucture/comments-query.repository';
import { ObjectId } from 'mongoose';

@Injectable()
export class CommentsService {
  constructor(
    protected commentRepo: CommentsRepository,
    protected commentQueryRepo: CommentsQueryRepository,
  ) /*protected likesDbRepo:LikesRepo*/ {}
  async createComment(
    content: string,
    postId: string,
    userId: string,
    userName: string,
  ) {
    const newComment = {
      content: content,
      postId: postId,
      userId: userId,
      userLogin: userName,
      createdAt: new Date().toISOString(),
    };

    const createdComment = await this.commentRepo.createComment(newComment);
    return createdComment;
  }
  async deleteComment(id: string) {
    return await this.commentRepo.deleteComment(id);
  }
  async updateComment(id: string, content: string) {
    return await this.commentRepo.updateComment(id, content);
  }

  async deleteAllComments() {
    return await this.commentRepo.deleteAll();
  }

  /*async makeLike(commentId:string, userId:ObjectId, status:string){
    const commentIdDb = new ObjectId(commentId)
    console.log("USERID")
    console.log(userId)
    const existedLike = await this.likesDbRepo.getLikeByCommentIdAndUserId(commentId,userId)
    const likeInfo:{commentId:ObjectId, userId:ObjectId, status:string} = {
      commentId:commentIdDb,
      userId,
      status
    }
    console.log(likeInfo)
    let like = null;
    if(existedLike){
      like = await this.likesDbRepo.updateLike(likeInfo)
    }
    else{
      like = await this.likesDbRepo.createLike(likeInfo);
    }
    return like;
  }*/
}
