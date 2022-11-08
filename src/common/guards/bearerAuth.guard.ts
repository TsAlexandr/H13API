import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '../../features/sessions/application/jwt.service';
import { UserQueryRepository } from '../../features/users/infrastructure/user-query.repository';

export class BearerAuthGuard implements CanActivate {
  constructor(
    private userQueryRepo: UserQueryRepository,
    private jwtService: JwtService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    if (!req.headers.authorization) {
      throw new UnauthorizedException();
    }
    const token = req.headers.authorization.split(' ')[1];

    console.log(token);
    const userId = await this.jwtService.getUserByAccessToken(token);
    console.log('UserId = ' + userId);
    if (!userId) {
      throw new UnauthorizedException();
    }

    req.user = await this.userQueryRepo.findById(userId);
    return true;
  }
}
