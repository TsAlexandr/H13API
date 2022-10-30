import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import {BlogQueryRepository} from "../infrastructure/blog-query.repository";
import { BlogService } from '../application/blog.service';
import { BlogQueryDto } from "../dto/blogQuery.dto";
import { CreateBlogDto } from "../dto/createBlog.dto";

@Controller('blogs')
export class BlogsController {

    constructor(protected  blogsService:BlogService,
                protected blogQueryRepo:BlogQueryRepository) {
    }

    @Get()
    async getAllBlogs(@Query() bqDto:BlogQueryDto){
        const data = await this.blogQueryRepo.findAllBlogs(bqDto.searchNameTerm, bqDto.pageNumber, bqDto.pageSize, bqDto.sortBy, bqDto.sortDirection);
        return data
    }

    @Post()
    async createBlog(@Body() cbDto:CreateBlogDto){
        await this.blogsService.createBlog(cbDto.name, cbDto.youtubeUrl)
    }

    @Get('/:blogId/posts')
    getAllPostsByBlogId(@Param() blogId:string,@Query() bqDto:BlogQueryDto){
    }

    @Post('/:blogId/posts')
    async createPostByBlogId(){
    }

    @Get('/:id')
    async getBlogById(@Param('id') id:string){
        return await this.blogQueryRepo.findBlogById(id)
    }

    @Put('/:id')
    async updateBlog(@Param('id') id:string, @Body() cbDto:CreateBlogDto){
        await this.blogsService.updateBlog(id, cbDto.name, cbDto.youtubeUrl)
    }

    @Delete('/:id')
    async deleteBlog(@Param('id') id:string){
        await this.blogsService.deleteBlog(id)
    }

}

