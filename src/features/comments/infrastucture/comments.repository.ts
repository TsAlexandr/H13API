import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from '../entities/comments.schema';

export class CommentsRepository {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  async createComment(comment: any) {
    const createdComment = new this.commentModel(comment);
    await createdComment.save();

    createdComment.likesInfo = {
      likesCount: 0,
      dislikesCount: 0,
      myStatus: 'None',
    };

    return createdComment.toJSON();
  }

  async updateComment(id: string, content: string) {
    const comment = await this.commentModel.findOne({
      _id: new mongoose.Types.ObjectId(id),
    });
    if (!comment) {
      return false;
    }

    comment.content = content;
    comment.save();
    return true;
  }

  async deleteComment(id: string) {
    const result = await this.commentModel.deleteOne({
      _id: new mongoose.Types.ObjectId(id),
    });
    return result.deletedCount === 1;
  }

  async deleteAll(): Promise<boolean> {
    const result = await this.commentModel.deleteMany({});
    return result.deletedCount > 1;
  }
}
