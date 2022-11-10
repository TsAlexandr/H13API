import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Headers,
  HttpCode,
  NotFoundException,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from '../application/comments.service';
import { CommentsQueryRepository } from '../infrastucture/comments-query.repository';
import { BearerAuthGuard } from '../../../common/guards/bearerAuth.guard';
import { User } from '../../../common/decorators/user.decorator';

@Controller('comments')
export class CommentsController {
  constructor(
    protected commentsService: CommentsService,
    protected commentQueryRepo: CommentsQueryRepository,
  ) {}

  @Put()
  @HttpCode(204)
  async makeLike(
    @Param('commentId') id: string,
    @User() user,
    @Body('likeStatus') likeStatus: string,
  ) {
    const comment = await this.commentQueryRepo.getCommentById(
      id /*, user.id*/,
    );
    if (!comment) {
      throw new NotFoundException();
    }
    const result = await this.commentsService.makeLike(id, user, likeStatus);
  }

  @Get(':id')
  async getComment(
    @Headers('authorization') header: string,
    @Param('id') id: string,
  ) {
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
    const comment = await this.commentQueryRepo.getCommentById(id);
    if (!comment) {
      throw new NotFoundException();
    }
    return comment;
  }

  @UseGuards(BearerAuthGuard)
  @Delete(':commentId')
  async deleteComment(@Param('commentId') id: string, @User() user) {
    const comment = await this.commentQueryRepo.getCommentById(id);
    if (!comment) {
      throw new NotFoundException();
    }
    /*if (comment.userId.toString() !== req.user.userId.toString()) {
      throw new ForbiddenException();
    }*/

    const isDeleted = await this.commentsService.deleteComment(comment.id);
  }

  @UseGuards(BearerAuthGuard)
  @Put(':commentId')
  async updateComment(
    @User() user,
    @Param('commentId') id: string,
    @Body('content') content: string,
  ) {
    const comment = await this.commentQueryRepo.getCommentById(id);
    if (!comment) {
      throw new NotFoundException();
    }

    if (comment.userId.toString() !== user.id.toString()) {
      throw new ForbiddenException();
    }

    const isModified = await this.commentsService.updateComment(
      comment.id,
      content,
    );
  }
}
