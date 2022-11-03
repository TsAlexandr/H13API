import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from '../entities/posts.schema';
import { Model, Types } from 'mongoose';
import * as mongoose from 'mongoose';

@Injectable()
export class PostsQueryRepository {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async findAllPosts(
    userId: string | null,
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: any,
  ) {
    console.log('PN ' + pageNumber);
    console.log('PS ' + pageSize);
    console.log(userId);

    let UserID = new mongoose.Types.ObjectId();
    if (userId && userId.length > 0) {
      UserID = new mongoose.Types.ObjectId(userId);
    }

    const posts = await this.postModel
      .aggregate([
        {
          $lookup: {
            from: 'likes',
            localField: '_id',
            foreignField: 'postId',
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
            foreignField: 'postId',
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
            foreignField: 'postId',
            pipeline: [
              {
                $match: { userId: UserID },
              },
              {
                $project: { _id: 0, status: 1 },
              },
            ],
            as: 'myStatus',
          },
        },
        {
          $lookup: {
            from: 'likes',
            localField: '_id',
            foreignField: 'postId',
            pipeline: [
              {
                $match: {
                  status: 'Like',
                },
              },
              {
                $sort: {
                  addedAt: -1,
                },
              },
              {
                $limit: 3,
              },
              {
                $project: {
                  addedAt: 1,
                  login: 1,
                  userId: 1,
                  _id: 0,
                },
              },
            ],
            as: 'newestLikes',
          },
        },
        {
          $project: {
            _id: 0,
            id: '$_id',
            title: 1,
            shortDescription: 1,
            content: 1,
            blogId: 1,
            blogName: 1,
            createdAt: 1,
            'extendedLikesInfo.likesCount': '$likesCount',
            'extendedLikesInfo.dislikesCount': '$dislikesCount',
            'extendedLikesInfo.myStatus': '$myStatus',
            'extendedLikesInfo.newestLikes': '$newestLikes',
          },
        },
      ])
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort({ [sortBy]: sortDirection });

    const totalCount = await this.postModel.countDocuments();

    const temp = posts.map((post) => {
      const likesCountArr = post.extendedLikesInfo.likesCount;
      const dislikesCountArr = post.extendedLikesInfo.dislikesCount;
      const myStatusArr = post.extendedLikesInfo.myStatus;
      console.log(post.extendedLikesInfo);

      /*const extendedLikesInfo = {
        likesCount: likesCountArr.length ? likesCountArr[0].count : 0,
        dislikesCount: dislikesCountArr.length ? dislikesCountArr[0].count : 0,
        myStatus: myStatusArr.length ? myStatusArr[0].status : 'None',
        newestLikes: post.extendedLikesInfo.newestLikes,
      };
      post.extendedLikesInfo = extendedLikesInfo;*/
      return post;
    });

    console.log(pageSize);
    const outputObj = {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: temp,
    };
    return outputObj;
  }
  async findPostById(id: string | null, userId: string) {
    if (!id) {
      return null;
    }

    const ID = new mongoose.Types.ObjectId(id);
    let UserID = new mongoose.Types.ObjectId();
    if (userId && userId.length > 0) {
      UserID = new mongoose.Types.ObjectId(userId);
    }
    const post = await this.postModel.findById(id);
    return post;
  }

  async getPostsByBlogId(
    userId: string,
    blogId: string,
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: any,
  ) {
    console.log(blogId);
    let UserID = new mongoose.Types.ObjectId();
    if (userId && userId.length > 0) {
      UserID = new mongoose.Types.ObjectId(userId);
    }
    const posts = await this.postModel.findOne({ blogId: blogId })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .sort({ [sortBy]: sortDirection });

    const totalCount: number = await this.postModel.count({
      blogId: blogId,
    });

    const outputObj = {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: posts,
    };
    return outputObj;
  }
}
