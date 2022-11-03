import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from '../entities/posts.schema';
import { Model } from 'mongoose';

@Injectable()
export class PostsRepository {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async deletePost(id: string) {
    const result = await this.postModel.deleteOne({ _id: id });
    return result.deletedCount === 1;
  }
  async createPost(post: any) {
    const createdPost = new this.postModel(post);
    createdPost.save();
    /*createdPost.extendedLikesInfo = {
      likesCount: 0,
      dislikesCount: 0,
      myStatus: 'None',
      newestLikes: [],
    };*/

    return createdPost;
  }
  async updatePost(
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
  ) {
    const post = await this.postModel.findById(id);
    if (!post) {
      return false;
    }
    post.title = title;
    post.shortDescription = shortDescription;
    post.content = content;
    post.blogId = blogId;

    post.save();
    return true;
  }

  async deleteAll() {
    return await this.postModel.deleteMany({});
  }
}
