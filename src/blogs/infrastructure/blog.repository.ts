import {Blog, BlogDocument, BlogsSchema} from "../entities/blogs.schema";
import {InjectModel} from "@nestjs/mongoose";
import {Model, Schema} from "mongoose";
import {Injectable} from "@nestjs/common";

@Injectable()
export class BlogsRepo {

    constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {
    }

    async createBlog(blog: any){

        const createdBlog = await this.blogModel.create(blog);
        await createdBlog.save()
        return createdBlog;
    }

    async deleteBlog(id: string): Promise<boolean> {
        const result = await this.blogModel.deleteOne({_id: id});
        return result.deletedCount === 1
    }

    async updateBlog(id: string, name: string, youtubeUrl: string): Promise<boolean> {
        const blog = await this.blogModel.findOne({_id: id})
        if (!blog) {
            return false
        }

        blog.name = name;
        blog.youtubeUrl = youtubeUrl
        blog.save();

        return true
    }

    async deleteAll(): Promise<boolean> {
        const result = await this.blogModel.deleteMany({})
        return result.deletedCount === 1
    }
}