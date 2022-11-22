import { Inject, Injectable } from '@nestjs/common';
import { BlogsRepo } from '../infrastructure/blog.repository';
import { CreateBlogDto } from '../dto/createBlog.dto';

@Injectable()
export class BlogService {
  constructor(protected blogsRepo: BlogsRepo) {}

  async createBlog(cbDto: CreateBlogDto) {
    const blog = {
      name: cbDto.name,
      websiteUrl: cbDto.websiteUrl,
      description: cbDto.description,
      createdAt: new Date().toISOString(),
    };

    const createdBlog = await this.blogsRepo.createBlog(blog);
    return createdBlog;
  }

  async deleteBlog(id: string) {
    return await this.blogsRepo.deleteBlog(id);
  }

  async updateBlog(id: string, name: string, websiteUrl: string, description: string) {
    return await this.blogsRepo.updateBlog(id, name, websiteUrl, description);
  }

  async deleteAllBlogs() {
    return await this.blogsRepo.deleteAll();
  }
}
