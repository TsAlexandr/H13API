import {Controller, Delete, Get, Post, Put, Query} from '@nestjs/common';
import {BlogsService} from "../../../../ht_12/src/application/blogs-service";
import {BlogQueryRepository} from "../infrastructure/blog-query.repository";

@Controller('blogs')
export class BlogsController {

    constructor(protected  blogsService:BlogsService,
                protected blogQueryRepo:BlogQueryRepository) {
    }

    @Get()
    async getAllBlogs(@Query() searchNameTerm:string,
                      @Query() pageNumber:string,
                      @Query() pageSize:string,
                      @Query() sortBy:string,
                      @Query() sortDirection:string){
        const data = await this.blogQueryRepo.findAllBlogs(searchNameTerm, +pageNumber, +pageSize, sortBy, sortDirection);
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

