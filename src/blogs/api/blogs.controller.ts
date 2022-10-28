import {Controller, Delete, Get, Post, Put} from '@nestjs/common';

@Controller('blogs')
export class BlogsController {

    @Get()
    getAllBlogs(){}

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

