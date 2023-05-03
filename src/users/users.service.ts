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
    console.log('create({ login, password, socketID })');
    console.log(login, password, socketID);
    const hashedPassword = await this.hashData(password);

    const inUserExists = await this.userRepository.findOneBy({
      login,
    });

    if (inUserExists !== null) {
      throw new HttpException('such user already exists', HttpStatus.FORBIDDEN);
    }

    const user = {
      login,
      password: hashedPassword,
      version: 1,
      online: true,
      socketID,
      avatar: 'https://i.ibb.co/pzMk1pf/2253542a88b4.png',
      hasUnreadMessage: false,
      messageForWho: [],
      createdAt: Number(Date.now()),
      updatedAt: Number(Date.now()),
    };

    // console.log(user);
    const newUser = this.userRepository.create(user);
    await this.userRepository.save(newUser);
    return newUser;
  }

  async getAll(): Promise<UserEntity[]> {
    const users = await this.userRepository.find();
    return users;
  }

  async addUserNameToMessageForWho(senderName: string, receiverName: string) {
    const senderUser = await this.findOneByUserLogin(senderName);
    const isResieverNameExist = senderUser.messageForWho.includes(receiverName);

    if (isResieverNameExist === true) return;

    senderUser.messageForWho.push(receiverName);
    await this.userRepository.save(senderUser);
  }

  async removeUserNameToMessageForWho(
    senderName: string,
    receiverName: string,
  ) {
    const receiverUser = await this.findOneByUserLogin(receiverName);
    const foundIndex = receiverUser.messageForWho.findIndex(
      (userName) => userName === senderName,
    );
    if (foundIndex === -1) return;

    receiverUser.messageForWho.splice(foundIndex, 1);
    await this.userRepository.save(receiverUser);
  }

  async selectUserForMessage(senderName: string, receiverName: string) {
    let foundUser = await this.findOneByUserLogin(senderName);
    if (foundUser === null) {
      return new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
    foundUser.targetForMessage = receiverName;
    await this.userRepository.save(foundUser);
  }

  async findOneByUserLogin(login: string) {
    // this is a temporary solution, watch the error on the front
    if (login === 'all') return;
    const user = await this.userRepository.findOneBy({ login });
    if (user === null) {
      throw new HttpException(`user ${login} not found`, HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async findOneById(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (user === null)
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    return user;
  }

  async findOneBySocketID(socketID: string) {
    const user = await this.userRepository.findOneBy({ socketID });
    if (user === null)
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    return user;
  }

  async update(user: UserEntity) {
    await this.userRepository.save(user);
  }

  async changeUserLogin(id: string, newUserLogin: string) {
    const user = await this.findOneById(id);

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

  async changeUserPassword(
    id: string,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this.findOneById(id);

    if (oldPassword !== user.password) {
      throw new HttpException('old password is wrong!', HttpStatus.FORBIDDEN);
    }

    user.password = newPassword;
    await this.userRepository.save(user);

    return user;
  }
}
