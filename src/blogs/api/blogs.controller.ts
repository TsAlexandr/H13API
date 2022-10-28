import {Controller, Delete, Get, Post, Put, Query} from '@nestjs/common';
import {BlogQueryRepository} from "../infrastructure/blog-query.repository";
import { BlogService } from '../application/blog.service';

@Controller('blogs')
export class BlogsController {

    constructor(protected  blogsService:BlogService,
                protected blogQueryRepo:BlogQueryRepository) {
    }

    @Get()
    async getAllBlogs(@Query() searchNameTerm:string,
                      @Query() pageNumber:string,
                      @Query() pageSize:string,
                      @Query() sortBy:string,
                      @Query() sortDirection:string){
        //const data = await this.blogQueryRepo.findAllBlogs(searchNameTerm, +pageNumber, +pageSize, sortBy, sortDirection);

        const data = await this.blogQueryRepo.findAllBlogs("", 1, 10, "createdAt", -1);
        return data
    }

    @Post()
    createBlog(){}

    @Get('/:blogId/posts')
    getAllPostsByBlogId(){}


    @Post('/:blogId/posts')
    createPostByBlogId(){}

    @Get('/:id')
    getBlogById(){}

    @Put('/:id')
    updateBlog(){}

    @Delete('/:id')
    deleteBlog(){}

}

