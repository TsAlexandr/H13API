import {
  BadRequestException,
  Injectable,
  NestMiddleware,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UserQueryRepository } from '../../features/users/infrastructure/user-query.repository';

@Injectable()
export class CheckExistingConfirmCodeMiddleware implements NestMiddleware {
  constructor(private userQueryRepo: UserQueryRepository) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const user = await this.userQueryRepo.getUserByCode(req.body.code);
    const expiredDate = new Date(user.emailConfirmation.expiredDate);
    if (!user || expiredDate < new Date()) {
      console.log('Throw exception');
      throw new BadRequestException([
        {
          message: 'Code is incorrect, expired or already been applied',
          field: 'code',
        },
      ]);
    }
    next();
  }
}
