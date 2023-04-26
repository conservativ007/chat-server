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
      avatar: 'cat',
      hasUnreadMessage: false,
      messageForWho: [],
      createdAt: Number(Date.now()),
      updatedAt: Number(Date.now()),
    };

    // console.log(user);
    const newUser = this.userRepository.create(user);
    return await this.userRepository.save(newUser);
  }

  async getAll(): Promise<UserEntity[]> {
    const users = await this.userRepository.find();
    return users;
  }

  async setStatusUserToOffline(socketID: string): Promise<void> {
    const users = await this.getAll();

    const foundIndex = users.findIndex((user) => user.socketID === socketID);

    if (foundIndex === -1) {
      return;
      // throw new Error('from setStatusUserToOffline');
    }
    const foundUser = users[foundIndex];
    foundUser.online = false;
    // foundUser.socketID = '';
    await this.userRepository.save(foundUser);
  }

  async Login(
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

  async addUserNameToMessageForWho(senderName: string, receiverName: string) {
    const senderUser = await this.findOne(senderName);
    const isResieverNameExist = senderUser.messageForWho.includes(receiverName);

    if (isResieverNameExist === true) return;

    senderUser.messageForWho.push(receiverName);
    await this.userRepository.save(senderUser);
  }

  async removeUserNameToMessageForWho(
    senderName: string,
    receiverName: string,
  ) {
    const receiverUser = await this.findOne(receiverName);
    const foundIndex = receiverUser.messageForWho.findIndex(
      (userName) => userName === senderName,
    );
    if (foundIndex === -1) return;

    receiverUser.messageForWho.splice(foundIndex, 1);
    await this.userRepository.save(receiverUser);
  }

  async selectUserForMessage(senderName: string, receiverName: string) {
    let foundUser = await this.findOne(senderName);
    if (foundUser === null) {
      return new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
    foundUser.targetForMessage = receiverName;
    await this.userRepository.save(foundUser);
  }

  async findOne(login: string) {
    const user = await this.userRepository.findOneBy({ login });
    return user;
  }

  async findOneBySocketID(socketID: string) {
    const user = await this.userRepository.findOneBy({ socketID });
    return user;
  }

  async update(user: UserEntity) {
    await this.userRepository.save(user);
  }

  async changeUserLogin(id: string, newUserLogin: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (user === null)
      throw new HttpException(
        'user not found changeUserAvatar',
        HttpStatus.NOT_FOUND,
      );

    const isUserAlreadyExist = await this.userRepository.findOne({
      where: { login: newUserLogin },
    });
    if (isUserAlreadyExist !== null)
      throw new HttpException(
        'the user with the same name already exists',
        HttpStatus.FORBIDDEN,
      );

    user.login = newUserLogin;
    await this.userRepository.save(user);
    return user;
  }
}
