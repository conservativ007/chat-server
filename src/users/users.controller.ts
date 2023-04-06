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

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  getAllUsers() {
    return this.userService.getAll();
  }

  @Post()
  async createUser(@Body() dto: CreateUserDto) {
    console.log('server: from post user ');
    console.log(dto);
    const user = await this.userService.create(dto);
    const serializeUser = new UserEntity(user);
    return serializeUser;
  }
}
