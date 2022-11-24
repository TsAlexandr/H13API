import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from '../entities/posts.schema';
import {Model, Schema, Types} from 'mongoose';
import * as mongoose from 'mongoose';
import { BlogQueryDto } from '../../blogs/dto/blogQuery.dto';
import {ObjectId} from 'mongodb'

@Injectable()
export class PostsQueryRepository {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async findAllPosts(
    userId: mongoose.Types.ObjectId | null,
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: any,
  ) {
    console.log(userId);
    const posts = await this.postModel
      .find()
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort({ [sortBy]: sortDirection });

    const totalCount = await this.postModel.countDocuments();

    console.log(pageSize);
    const outputObj = {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: posts,
    };
    return outputObj;
  }

  async getPostById(id: string) {
    const post = await this.postModel.findOne({ _id: id });
    return post;
  }
  async findPostById(id: string | null, currentUserId: any) {
    if (!id) {
      return null;
    }

    const post = await this.postModel.findOne({_id: new ObjectId(id)})
    return post
  }

  async getPostsByBlogId(
    blogId: string,
    bqDto: BlogQueryDto,
    currentId: mongoose.Types.ObjectId,
  ) {
    console.log(blogId);
    const { pageNumber, pageSize, sortBy, sortDirection } = bqDto;

    const posts = await this.postModel
      .find({blogId: blogId})
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      //TODO: решить вопрос с типом sortDirection
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
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
