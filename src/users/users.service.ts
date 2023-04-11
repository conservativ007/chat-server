import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async hashData(data: string) {
    return hash(data, 10);
  }

  async create({ login, password, socketID }): Promise<UserEntity> {
    // const hashedPassword = await this.hashData(password);

    const inUserExists = await this.userRepository.findOneBy({
      login,
    });

    if (inUserExists !== null) {
      throw new HttpException('such user already exists', HttpStatus.FORBIDDEN);
    }

    const user = {
      login,
      // password: hashedPassword,
      password,
      version: 1,
      online: true,
      socketID,
      createdAt: Number(Date.now()),
      updatedAt: Number(Date.now()),
    };

    // console.log(user);
    const newUser = this.userRepository.create(user);
    return await this.userRepository.save(newUser);
  }

  async getAll(): Promise<UserEntity[]> {
    const users = await this.userRepository.find();
    console.log('from getAll() user service');
    console.log(users);
    return users;
  }

  async setStatusUserToOffline(socketID: string): Promise<void> {
    const users = await this.getAll();

    console.log('from setStatusUserToOffline id: ', socketID);
    const foundIndex = users.findIndex((user) => user.socketID === socketID);

    if (foundIndex === -1) {
      console.log(users);
      console.log('user not found!');
      return;
      // throw new Error('from setStatusUserToOffline');
    }
    const foundUser = users[foundIndex];
    foundUser.online = false;
    foundUser.socketID = '';
    await this.userRepository.save(foundUser);
  }

  async getByLogin(
    login: string,
    password: string,
    socketID: string,
  ): Promise<UserEntity> {
    let user = await this.userRepository.findOne({
      where: {
        login,
        password,
      },
    });

    if (user === null) {
      throw new HttpException('ivalid login or password', HttpStatus.NOT_FOUND);
    }

    user.socketID = socketID;
    user.online = true;
    await this.userRepository.save(user);
    return user;
  }

  async findOne(login: string) {
    const user = await this.userRepository.findOneBy({ login });
    return user;
  }
}
