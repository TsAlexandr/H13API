import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  Ip,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import dayjs from 'dayjs';
import { SessionsService } from '../../sessions/application/sessions.service';
import { AuthService } from '../application/auth.service';
import { JwtService } from '../../sessions/application/jwt.service';
import { UsersService } from '../../users/application/users.service';
import { Response } from 'express';
import { LoginDto } from '../dto/login.dto';
import { NewPasswordDto } from '../dto/newPassword.dto';
import { RefreshToken } from '../../../common/decorators/cookies.decorator';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { User } from '../../../common/decorators/user.decorator';
import { UserQueryRepository } from '../../users/infrastructure/user-query.repository';
import { BearerAuthGuard } from '../../../common/guards/bearerAuth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    protected sessionService: SessionsService,
    protected userService: UsersService,
    protected authService: AuthService,
    protected jwtService: JwtService,
    private userQueryRepo: UserQueryRepository,
  ) {}

  @Post('password-recovery')
  @HttpCode(204)
  async passwordRecovery(@Body('email') email: string) {
    await this.authService.sendRecoveryCode(email);
    return true;
  }

  @Post('new-password')
  async changePassword(@Body() npDto: NewPasswordDto) {
    console.log(npDto.newPassword, ' NEW PASSWORD ', npDto.recoveryCode);
    const confirmation = await this.authService.confirmPassword(npDto);
    if (!confirmation) {
      throw new BadRequestException();
    } /*res.status(400).send({
        errorsMessages: [
          { message: "Некорректный recoveryCode", field: "recoveryCode" }
        ]
      })
      return
    }*/
    return true;
  }

  @Post('login')
  async login(
    @Res({ passthrough: true }) res: Response,
    @Ip() ip: string,
    @Headers('user-agent') agent: string,
    @Body() loginDto: LoginDto,
  ) {
    const user = await this.userService.checkCredentials(loginDto);
    if (!user) {
      throw new UnauthorizedException();
    }
    const session = await this.sessionService.createSession(user, ip, agent);

    if (!session) {
      console.log('!!! NE SESSION !!! ');
      throw new UnauthorizedException();
    }
    res.cookie('refreshToken', session.refreshToken, {
      secure: true,
      expires: dayjs().add(20, 'seconds').toDate(),
      httpOnly: true,
    });

    return { accessToken: session.accessToken };
  }

  @Post('refresh-token')
  async refresh(@RefreshToken() refreshToken: string, @Res() res: Response) {
    if (!refreshToken) {
      throw new UnauthorizedException();
    }
    const tokens = await this.sessionService.updateSession(refreshToken);
    if (!tokens) {
      throw new UnauthorizedException();
    }
    res.cookie('refreshToken', tokens.refreshToken, {
      expires: dayjs().add(20, 'seconds').toDate(),
      secure: true,
      httpOnly: true,
    });
    return {
      accessToken: tokens.accessToken,
    };
  }

  @Post('registration-confirmation')
  @HttpCode(204)
  async confirmRegistration(@Body('code') code: string) {
    const result = await this.authService.confirmEmail(code);

    console.log(result);
    if (!result) throw new BadRequestException();
    return result;
  }

  @Post('registration')
  @HttpCode(204)
  async registration(@Body() newUser: CreateUserDto) {
    const createdUser = await this.userService.createUser(newUser);

    if (!createdUser) {
      throw new BadRequestException();
    }
  }

  @Post('registration-email-resending')
  @HttpCode(204)
  async resendEmailConfirmation(@Body('email') email: string) {
    await this.authService.resendConfirmCode(email);
  }

  @Post('logout')
  @HttpCode(204)
  async logout(@RefreshToken() refreshToken, @Res() res: Response) {
    if (!refreshToken) {
      throw new UnauthorizedException();
    }
    const payload = await this.jwtService.getPayloadByRefreshToken(
      refreshToken,
    );
    if (!payload) {
      throw new UnauthorizedException();
    }

    await this.sessionService.removeSessionByDeviceId(
      payload.userId,
      payload.deviceId,
    );
    res.clearCookie('refreshToken');
  }

  @UseGuards(BearerAuthGuard)
  @Get('me')
  async getInfoAboutMe(@User() user: any) {
    /*if(user){
      delete Object.assign(user, {["userId"]: user["id"] })["id"]
    }*/

    return await this.userQueryRepo.findById(user.id);
  }
}
