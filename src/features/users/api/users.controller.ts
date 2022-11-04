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
  Query,
} from '@nestjs/common';
import { UsersService } from '../application/users.service';
import { UserQueryRepository } from '../infrastructure/user-query.repository';
import { UserQueryDto } from '../dto/userQuery.dto';
import { CreateUserDto } from '../dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(
    protected userService: UsersService,
    protected userQueryRepo: UserQueryRepository,
  ) {}
  @Get()
  async getAllUsers(@Query() uqDto: UserQueryDto) {
    const users = await this.userQueryRepo.getUsers(
      uqDto.searchLoginTerm,
      uqDto.searchEmailTerm,
      uqDto.pageNumber,
      uqDto.pageSize,
      uqDto.sortBy,
      uqDto.sortDirection,
    );
    return users;
  }

  @Post()
  async createUser(@Body() cuDto: CreateUserDto) {
    const createdUser = await this.userService.createUser(
      cuDto.login,
      cuDto.password,
      cuDto.email,
    );
    return createdUser;
  }

  @Delete('/:id')
  @HttpCode(204)
  async deleteUser(@Param('id') id: string) {
    const isDeleted = await this.userService.deleteUser(id);
    if (!isDeleted) throw new NotFoundException();

    return isDeleted;
  }
}
