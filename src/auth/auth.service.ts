import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Tokens } from './types';
import { UserEntity } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { AuthDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async updateRtHash(user: UserEntity, rt: string) {
    const hashedRefreshToken = await this.hashData(rt);
    user.hashedRt = hashedRefreshToken;
    await this.userRepository.save(user);
  }

  async getTokens(userId: string, login: string): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        { userId, login },
        {
          secret: process.env.JWT_SECRET_KEY,
          expiresIn: 60 * 15,
        },
      ),
      this.jwtService.signAsync(
        { userId, login },
        {
          secret: process.env.JWT_SECRET_REFRESH_KEY,
          expiresIn: 60 * 60 * 24 * 7,
        },
      ),
    ]);
    return {
      accessToken: at,
      refreshToken: rt,
    };
  }

  // be careful in this keys we call to usersService not userRepository
  async signup(dto: CreateUserDto) {
    const user: UserEntity = await this.usersService.create(dto);

    const tokens = await this.getTokens(user.id, user.login);
    await this.updateRtHash(user, tokens.refreshToken);
    return [user, tokens];
  }

  async login(dto: AuthDto) {
    // throw new ForbiddenException('Access Denied');
    const { login, password } = dto;
    const user: UserEntity = await this.usersService.findOneByUserLogin(login);

    // compare passwords
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) throw new ForbiddenException('Access Denied');

    // update refresh token
    const tokens = await this.getTokens(user.id, user.login);
    await this.updateRtHash(user, tokens.refreshToken);

    // user.socketID = socketID;
    user.online = true;
    await this.userRepository.save(user);

    return [user, tokens];
  }

  async logout(userId: string, unexpectedDisconnect: boolean) {
    let user: UserEntity;
    if (unexpectedDisconnect === true) {
      user = await this.usersService.findOneBySocketID(userId);
    }
    if (unexpectedDisconnect === false) {
      user = await this.usersService.findOneById(userId);
    }

    // temporary solution
    if (user === null || user === undefined) return;

    user.hashedRt = null;
    user.online = false;
    user.targetForMessage = 'all';
    await this.userRepository.save(user);
  }

  async refreshTokens(userId: string, rt: string) {
    const user = await this.usersService.findOneById(userId);

    const rtMatches = bcrypt.compare(rt, user.hashedRt);
    if (!rtMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.login);
    await this.updateRtHash(user, tokens.refreshToken);
  }

  async attachSocketToUser(socketId: string, userId: string) {
    const user = await this.usersService.findOneById(userId);
    user.socketID = socketId;
    await this.userRepository.save(user);

    return user.socketID;
  }

  async verifyAccessToken(token: string) {
    try {
      return await this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET_KEY,
      });
    } catch (error) {
      throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
    }
  }

  // DANGER ZONE
  async delete(userId: string) {
    const user = await this.usersService.findOneById(userId);
    await this.userRepository.remove(user);
  }
}
