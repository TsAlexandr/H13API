import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from '../entities/comments.schema';
import mongoose from 'mongoose';
import { PostQueryDto } from '../../posts/dto/postQuery.dto';

export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  async getCommentById(id: string) {
    return this.commentModel.findById(id);
  }

  async getCommentsByPostId(
    userId: string,
    postId: string,
    query: PostQueryDto,
  ) {
    const { pageNumber, pageSize, sortDirection, sortBy } = query;
    const comments = await this.commentModel
      .aggregate([
        { $match: { postId: new mongoose.Types.ObjectId(postId) } },
        {
          $lookup: {
            from: 'likes',
            localField: '_id',
            foreignField: 'commentId',
            pipeline: [
              {
                $match: {
                  status: 'Like',
                },
              },
              {
                $count: 'count',
              },
            ],
            as: 'likesCount',
          },
        },
        {
          $lookup: {
            from: 'likes',
            localField: '_id',
            foreignField: 'commentId',
            pipeline: [
              {
                $match: {
                  status: 'Dislike',
                },
              },
              {
                $count: 'count',
              },
            ],
            as: 'dislikesCount',
          },
        },
        {
          $lookup: {
            from: 'likes',
            localField: '_id',
            foreignField: 'commentId',
            pipeline: [
              {
                $match: { userId: new mongoose.Types.ObjectId(userId) },
              },
              {
                $project: { _id: 0, status: 1 },
              },
            ],
            as: 'myStatus',
          },
        },
        {
          $project: {
            _id: 0,
            id: '$_id',
            content: 1,
            userId: 1,
            userLogin: 1,
            createdAt: 1,
            'likesInfo.likesCount': '$likesCount',
            'likesInfo.dislikesCount': '$dislikesCount',
            'likesInfo.myStatus': '$myStatus',
          },
        },
      ])
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      .sort({ [sortBy]: sortDirection });
    const temp = comments.map((comment) => {
      const likesCountArr = comment.likesInfo.likesCount;
      const dislikesCountArr = comment.likesInfo.dislikesCount;
      const myStatusArr = comment.likesInfo.myStatus;

      const likesInfo = {
        likesCount: likesCountArr.length ? likesCountArr[0].count : 0,
        dislikesCount: dislikesCountArr.length ? dislikesCountArr[0].count : 0,
        myStatus: myStatusArr.length ? myStatusArr[0].status : 'None',
      };
      comment.likesInfo = likesInfo;
      return comment;
    });
    console.log(temp);

    const totalCount = await this.commentModel.countDocuments({
      postId: new mongoose.Types.ObjectId(postId),
    });

    return {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: comments,
    };
  }
}
