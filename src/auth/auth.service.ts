import { ForbiddenException, Injectable } from '@nestjs/common';
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

    await this.userRepository.save({
      ...user,
      hashedRt: hashedRefreshToken,
    });
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
    // console.log(`signup`);
    // console.log(user);
    // return user;

    return [user, tokens];
  }

  async login(dto: AuthDto) {
    const { login, password, socketID } = dto;
    const user: UserEntity = await this.usersService.findOneByUserLogin(login);

    // compare passwords
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) throw new ForbiddenException('Access Denied');

    // update refresh token
    const tokens = await this.getTokens(user.id, user.login);
    await this.updateRtHash(user, tokens.refreshToken);

    user.socketID = socketID;
    user.online = true;
    await this.userRepository.save(user);

    return [user, tokens];
  }

  async logout(socketID: string) {
    const user: UserEntity = await this.usersService.findOneBySocketID(
      socketID,
    );

    user.hashedRt = null;
    user.online = false;
    user.targetForMessage = 'all';
    await this.userRepository.save(user);
  }

  refreshTokens() {}
}
