import { Injectable } from '@nestjs/common';
import { CommentsRepository } from '../infrastucture/comments.repository';
import { CommentsQueryRepository } from '../infrastucture/comments-query.repository';
import { ObjectId } from 'mongoose';
import { LikesRepository } from '../infrastucture/likes.repository';
import { LikesInfo } from '../entities/likesInfo.schema';
import { Like } from '../entities/likes.schema';

@Injectable()
export class CommentsService {
  constructor(
    protected commentRepo: CommentsRepository,
    protected commentQueryRepo: CommentsQueryRepository,
    private likesRepo: LikesRepository,
  ) {}
  async createComment(content: string, postId: string, user: any) {
    const newComment = {
      content: content,
      postId: postId,
      userId: user.id,
      userLogin: user.is,
      createdAt: new Date().toISOString(),
      isBanned: user.banInfo.isBanned,
    };

    console.log();

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

  async makeLike(commentId: string, user: any, status: string) {
    const commentIdDb = commentId;
    console.log('USERID');
    console.log(user);
    const existedLike = await this.likesRepo.getLikeByCommentIdAndUserId(
      commentId,
      user.id,
    );

    const likeInfo = {
      commentId,
      userId: user.id,
      login: user.login,
      isBanned: user.banInfo.isBanned,
      status,
      addedAt: new Date().toISOString(),
    };

    let like = null;
    if (existedLike) {
      like = await this.likesRepo.updateLike(likeInfo);
    } else {
      like = await this.likesRepo.createLike(likeInfo);
    }
    return like;
  }
}
