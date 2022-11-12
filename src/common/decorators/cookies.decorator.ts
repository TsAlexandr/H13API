import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const RefreshToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    console.log(request.cookies);
    if (!request.cookies) return null;
    return request.cookies.refreshToken;
  },
);
