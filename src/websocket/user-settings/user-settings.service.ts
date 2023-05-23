import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserSettingsService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

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
