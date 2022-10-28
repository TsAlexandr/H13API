import {blogType} from "../../../../ht_12/src/types";
import {Inject, Injectable} from "@nestjs/common";
import {BlogsRepo} from "../infrastructure/blog.repository";
@Injectable()
export class BlogService {
    constructor(protected blogsRepo:BlogsRepo) {
    }

    /*async findAllBlogs(searchNameTerm: any, pageNumber: number, pageSize: number, sortBy: any, sortDirection: any) {
        return await this.blogsRepo.findAllBlogs(searchNameTerm, pageNumber, pageSize, sortBy, sortDirection);
    }

    async findBlogById(id: string) {
        return this.blogsRepo.findBlogById(id);
    }*/

    async createBlog(name: string, youtubeUrl: string) {
        const blog: blogType = {
            name: name,
            youtubeUrl: youtubeUrl,
            createdAt: new Date().toISOString()
        }

        const createdBlog = await this.blogsRepo.createBlog(blog);
        return createdBlog;
    }

    async deleteBlog(id: string) {
        return await this.blogsRepo.deleteBlog(id);
    }

    async updateBlog(id: string, name: string, youtubeUrl: string) {
        return await this.blogsRepo.updateBlog(id, name, youtubeUrl);
    }
}