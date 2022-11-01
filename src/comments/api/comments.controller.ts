import { Controller, Delete, Get, NotFoundException, Param } from "@nestjs/common";
import { PostsService } from "../../posts/application/posts.service";
import { PostsQueryRepository } from "../../posts/infrastructure/posts-query.repository";
import { CommentsService } from "../application/comments.service";
import { CommentsQueryRepository } from "../infrastucture/comments-query.repository";

@Controller('comments')
export class CommentsController {

    constructor(protected commentsService:CommentsService,
                protected  commentQueryRepo:CommentsQueryRepository) {

    }

    @Get(':id')
    async getComment(@Param('id') id:string){
        //let currentUserId = new ObjectId();
        /*if(req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1]
            console.log(token)
            const userId = await this.jwtService.getUserByAccessToken(token);
            console.log("UserId = " + userId)

            if(userId){
                const user = await this.userService.getUserById(userId.toString());
                if(user){currentUserId = user.id}
            }
        }*/
        const comment = await this.commentQueryRepo.getCommentById(id)
        if(!comment){
            throw new NotFoundException()
        }
        return comment
    }
    /*@Delete()
    async deleteComment(req:Request, res:Response){
        //@ts-ignore
        const comment = await this.commentsService.getCommentByID(req.params.commentId, req.user.id);
        if(!comment){
            res.send(404)
            return
        }
        //@ts-ignore
        if(comment.userId.toString() !== req.user.userId.toString()){
            res.send(403)
            return
        }

        const isDeleted = await this.commentsService.deleteComment(comment.id)
        res.send(204)
    }

    async updateComment(req:Request, res:Response){//@ts-ignore
        const comment = await this.commentsService.getCommentByID(req.params.commentId, req.user.id);
        if(!comment){
            res.send(404)
            return
        }
        console.log(comment.userId)
        //@ts-ignore
        console.log(req.user.userId)
        //@ts-ignore
        if(comment.userId.toString() !== req.user.userId.toString()){
            res.send(403)
            return
        }

        const isModified = await this.commentsService.updateComment(comment.id, req.body.content)
        res.send(204)
    }*/
}
