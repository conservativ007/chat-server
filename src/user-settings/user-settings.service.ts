import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserSettingsService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  findAll() {
    return `This action returns all userSettings`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userSetting`;
  }

  async changeUserAvatar(id: string, avatar: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (user === null)
      throw new HttpException(
        'user not found changeUserAvatar',
        HttpStatus.NOT_FOUND,
      );

    user.avatar = avatar;
    await this.userRepository.save(user);

    return user;
  }
}
