import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../application/users.service';
import { UserQueryRepository } from '../infrastructure/user-query.repository';
import { UserQueryDto } from '../dto/userQuery.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { BasicAuthGuard } from '../../../common/guards/basicAuth.guard';
import { BanDto } from '../dto/ban.dto';

@Controller('users')
export class UsersController {
  constructor(
    protected userService: UsersService,
    protected userQueryRepo: UserQueryRepository,
  ) {}

  @UseGuards(BasicAuthGuard)
  @Get()
  async getAllUsers(@Query() uqDto: UserQueryDto) {
    const users = await this.userQueryRepo.getUsers(uqDto);
    return users;
  }

  @UseGuards(BasicAuthGuard)
  @Post()
  async createUser(@Body() cuDto: CreateUserDto) {
    const createdUser = await this.userService.createUser(cuDto);
    return createdUser;
  }

  @UseGuards(BasicAuthGuard)
  @Delete('/:id')
  @HttpCode(204)
  async deleteUser(@Param('id') id: string) {
    const user = await this.userQueryRepo.findById(id);
    if (!user) throw new NotFoundException();

    const isDeleted = await this.userService.deleteUser(id);
    if (!isDeleted) throw new NotFoundException();

    return isDeleted;
  }

  @UseGuards(BasicAuthGuard)
  @Put(':id/ban')
  async banUser(@Param('id') id: string, @Body() banDto: BanDto) {
    await this.userService.banUser(id, banDto);
  }
}
