import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { BlogQueryRepository } from '../../features/blogs/infrastructure/blog-query.repository';

@Injectable()
export class CheckExistingBlogForPostMiddleware implements NestMiddleware {
  constructor(private blogQueryRepo: BlogQueryRepository) {}
  async use(req: Request, res: Response, next: NextFunction) {
    console.log('Middleware -->', req.body.blogId);
    const blog = await this.blogQueryRepo.findBlogById(req.body.blogId);
    req.body.blog = blog;
    console.log(blog);
    if (!blog) {
      console.log('Throw exception');
      throw new NotFoundException();
    }
    next();
  }
}
