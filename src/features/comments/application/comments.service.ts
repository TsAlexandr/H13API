import { Injectable } from '@nestjs/common';
import { CommentsRepository } from '../infrastucture/comments.repository';
import { CommentsQueryRepository } from '../infrastucture/comments-query.repository';
import { ObjectId } from 'mongoose';
import { LikesRepository } from '../infrastucture/likes.repository';

@Injectable()
export class CommentsService {
  constructor(
    protected commentRepo: CommentsRepository,
    protected commentQueryRepo: CommentsQueryRepository,
    private likesRepo: LikesRepository,
  ) {}
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

  async makeLike(commentId: string, userId: string, status: string) {
    const commentIdDb = commentId;
    console.log('USERID');
    console.log(userId);
    const existedLike = await this.likesRepo.getLikeByCommentIdAndUserId(
      commentId,
      userId,
    );
    const likeInfo: { commentId: string; userId: string; status: string } = {
      commentId: commentIdDb,
      userId,
      status,
    };
    console.log(likeInfo);
    let like = null;
    if (existedLike) {
      like = await this.likesRepo.updateLike(likeInfo);
    } else {
      like = await this.likesRepo.createLike(likeInfo);
    }
    return like;
  }
}
