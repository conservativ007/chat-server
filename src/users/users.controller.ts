import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserLoginDto } from './dto/update-user-login.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  getAllUsers() {
    return this.userService.getAll();
  }

  @HttpCode(200)
  @Post('/change-username')
  async changeUserName(@Body() dto: UpdateUserLoginDto) {
    const user = await this.userService.changeUserLogin(
      dto.userId,
      dto.newLogin,
    );
    return user;
  }

  @HttpCode(200)
  @Post('/change-userpassword')
  async changeUserPassword(@Body() dto: UpdateUserPasswordDto) {
    console.log('/change-userpassword');
    console.log(dto);
    const user = await this.userService.changeUserPassword(dto);
    return user;
  }

  @HttpCode(200)
  @Get(':id')
  async getUserById(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.userService.findOneById(id);
    return user;
  }
}
