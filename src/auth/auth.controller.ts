import {
  Body,
  Controller,
  HttpCode,
  Post,
  Delete,
  UseGuards,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LogoutDto } from './dto/logout.dto';
import { RefreshDto } from './dto/refresh.dto';
import { AttachSocketDto } from './dto/attach-socket.dto';
import { RtGuard } from './common/guards';
import { Public } from './common/decorators';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(201)
  @Public()
  @Post('/signup')
  async signup(@Body() dto: CreateUserDto) {
    return await this.authService.signup(dto);
  }

  @HttpCode(200)
  @Public()
  @Post('/login')
  async login(@Body() dto: CreateUserDto) {
    return await this.authService.login(dto);
  }

  @HttpCode(200)
  @Post('/logout')
  async logout(@Body() { userId }: LogoutDto) {
    await this.authService.logout(userId, false);
  }

  @Public()
  @UseGuards(RtGuard)
  @HttpCode(200)
  @Post('/refresh')
  async refreshTokens(@Body() { userId, rt }: RefreshDto) {
    await this.authService.refreshTokens(userId, rt);
  }

  @HttpCode(204)
  @Delete('/delete/:userId')
  async delete(@Param() { userId }: LogoutDto) {
    await this.authService.delete(userId);
  }

  @Public()
  @HttpCode(200)
  @Post('/attachsocket')
  async attachsocket(@Body() dto: AttachSocketDto) {
    const { socketId, userId } = dto;
    const socketIdFromService = await this.authService.attachSocketToUser(
      socketId,
      userId,
    );
    return socketIdFromService;
  }
}
