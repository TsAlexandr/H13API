import {Controller, Delete, Get, Post, Put} from '@nestjs/common';

@Controller('posts')
export class PostsController {
    @Get(':postId/comments')
    getCommentByPostId() {
    }

    @Get()
    getAllPosts() {
    }

    @Post()
    createPost(){}

    @Get(':id')
    getPostById(){}

    @Put(':id')
    updatePost(){}

    @Delete()
    deletePost(){}
}


