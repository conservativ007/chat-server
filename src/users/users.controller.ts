import { Controller, Get, Post, Body, HttpCode } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserLoginDto } from './dto/update-user-login.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  getAllUsers() {
    return this.userService.getAll();
  }

  @Post()
  async createUser(@Body() dto: CreateUserDto) {
    const user = await this.userService.create(dto);
    return user;
  }

  @Post('/login')
  async loginUser(@Body() dto: LoginUserDto) {
    const user = await this.userService.Login(
      dto.login,
      dto.password,
      dto.socketID,
    );

    const serializeUser = new UserEntity(user);
    return serializeUser;
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
    const { userId, newPassword, oldPassword } = dto;
    const user = await this.userService.changeUserPassword(
      userId,
      oldPassword,
      newPassword,
    );
    return user;
  }
}
