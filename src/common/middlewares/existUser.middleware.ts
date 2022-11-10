import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UserQueryRepository } from '../../features/users/infrastructure/user-query.repository';

@Injectable()
export class CheckExistingUserMiddleware implements NestMiddleware {
  constructor(private userQueryRepo: UserQueryRepository) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const userByLogin = await this.userQueryRepo.findByLogin(req.body.login);
    const userByEmail = await this.userQueryRepo.findByLogin(req.body.email);
    if (userByLogin || userByEmail) {
      console.log('Throw exception');
      throw new NotFoundException();
    }
    next();
  }
}
