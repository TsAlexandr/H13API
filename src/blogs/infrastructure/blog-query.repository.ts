import {InjectModel} from "@nestjs/mongoose";
import {Blog, BlogDocument} from "../entities/blogs.schema";
import { Model, Schema } from "mongoose";
import {Injectable} from "@nestjs/common";
import * as mongoose from "mongoose";


@Injectable()
export class BlogQueryRepository{
    constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {
    }
    async findAllBlogs(searchNameTerm: any, pageNumber: number, pageSize: number, sortBy: string, sortDirection: any): Promise<{ pagesCount: number; pageSize: number; page: number; totalCount: number; items: any[] }> {

        console.log("searchNameTerm " + searchNameTerm);

        const blogs = await this.blogModel.find({"name": {$regex: searchNameTerm, $options: 'i'}})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort({[sortBy]: sortDirection})

        const totalCount = await this.blogModel.count({"name": {$regex: searchNameTerm, $options: 'i'}});

        const outputObj = {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: blogs
        }
        return outputObj
    }

    async findBlogById(id: string): Promise<any> {
        const blog = await this.blogModel.findOne({_id: id});
        return blog
    }
}