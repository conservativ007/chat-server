import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { WebSocketGateway } from '@nestjs/websockets';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  getAllUsers() {
    return this.userService.getAll();
  }

  @Post()
  async createUser(@Body() dto: CreateUserDto) {
    console.log('server: from createUser user ');
    console.log(dto);

    const user = await this.userService.create(dto);
    // const serializeUser = new UserEntity(user);
    return user;
  }

  @Post('/login')
  async loginUser(@Body() dto: LoginUserDto) {
    console.log('server: from loginUser ');
    console.log(dto);
    const user = await this.userService.Login(
      dto.login,
      dto.password,
      dto.socketID,
    );

    // const user = await this.userService.create(dto);
    const serializeUser = new UserEntity(user);
    return serializeUser;
  }
}
