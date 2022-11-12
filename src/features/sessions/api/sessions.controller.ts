import {
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '../application/jwt.service';
import { SessionsService } from '../application/sessions.service';
import { RefreshToken } from '../../../common/decorators/cookies.decorator';

@Controller('security/devices')
export class SessionsController {
  constructor(
    private jwtService: JwtService,
    private sessionService: SessionsService,
  ) {}
  @Get()
  async geSessionsByUser(@RefreshToken() refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException();
    }
    const payload = await this.jwtService.getPayloadByRefreshToken(
      refreshToken,
    );
    if (!payload) {
      throw new UnauthorizedException();
    }
    const sessions = await this.sessionService.getSessionsByUserId(
      payload.userId,
    );
    return sessions;
  }

  @Delete()
  @HttpCode(204)
  async terminateNotActualSessions(@RefreshToken() refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException();
    }
    const payload = await this.jwtService.getPayloadByRefreshToken(
      refreshToken,
    );
    if (!payload) {
      throw new UnauthorizedException();
    }
    const isDeleted = await this.sessionService.removeSessionsByUserId(
      payload.userId,
      payload.deviceId,
    );
    if (!isDeleted) {
      throw new UnauthorizedException();
    }
    return true;
  }

  @Delete(':deviceId')
  @HttpCode(204)
  async terminateSessionById(
    @RefreshToken() refreshToken: string,
    @Param('deviceId') id: string,
  ) {
    if (!refreshToken) {
      throw new UnauthorizedException();
    }
    const payload = await this.jwtService.getPayloadByRefreshToken(
      refreshToken,
    );
    if (!payload) {
      throw new UnauthorizedException();
    }
    const session = await this.sessionService.getSessionByDeviceId(id);
    if (!session) {
      throw new NotFoundException();
    }

    const payloadUserId = payload.ObjectId;
    console.log(payloadUserId);
    if (session.userId !== payload.userId) {
      throw new ForbiddenException();
    }

    const isDeleted = await this.sessionService.removeSessionByDeviceId(
      payload.userId,
      id,
    );

    console.log(isDeleted);
    return isDeleted;
  }
}
