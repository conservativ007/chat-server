import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { WebSocketServer } from '@nestjs/websockets';

import { Server } from 'socket.io';
import { UsersService } from 'src/users/users.service';
import { LogoutDto } from './dto/logout.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @WebSocketServer()
  server: Server;

  @HttpCode(201)
  @Post('/signup')
  async signup(@Body() dto: CreateUserDto) {
    return await this.authService.signup(dto);
  }

  @HttpCode(200)
  @Post('/login')
  async login(@Body() dto: AuthDto) {
    console.log('auth login');
    console.log(dto);
    return await this.authService.login(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @HttpCode(200)
  @Post('/logout')
  async logout(@Body() { socketID }: LogoutDto) {
    await this.authService.logout(socketID);
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @HttpCode(200)
  @Post('/refresh')
  async refreshTokens() {
    await this.authService.refreshTokens();
  }
}
