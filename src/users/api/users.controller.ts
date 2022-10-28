import {Controller, Delete, Get, Param, Post} from '@nestjs/common';

@Controller('users')
export class UsersController {

    @Get()
    getAllUsers(){}

    @Post()
    createUser(){}

    @Delete('/:id')
    deleteUser(@Param() id:string){}
}
