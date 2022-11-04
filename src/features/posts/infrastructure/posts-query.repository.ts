import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from '../entities/posts.schema';
import { Model, Types } from 'mongoose';
import * as mongoose from 'mongoose';
import { BlogQueryDto } from '../../blogs/dto/blogQuery.dto';

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
    const posts = await this.postModel
      .find({})
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
  async findPostById(id: string | null) {
    if (!id) {
      return null;
    }

    const post = await this.postModel.findById(id);
    return post;
  }

  async getPostsByBlogId(blogId: string, bqDto: BlogQueryDto) {
    console.log(blogId);
    const { pageNumber, pageSize, sortBy, sortDirection } = bqDto;

    const posts = await this.postModel
      .find({ blogId: blogId })
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
