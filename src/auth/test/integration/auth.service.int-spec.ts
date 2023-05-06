import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { AuthService } from 'src/auth/auth.service';
import { Tokens } from 'src/auth/types';
import { UpdateUserPasswordDto } from 'src/users/dto/update-user-password.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

import { compare } from 'bcrypt';

describe('AuthService Int', () => {
  let authService: AuthService;
  let userService: UsersService;

  let user: UserEntity;
  let tokens: Tokens;

  const newLogin = 'new-login';
  let updatedUser: UserEntity;

  const testUser = {
    login: 'test-login',
    password: '123',
    version: 1,
    online: true,
    socketID: null,
    avatar: 'https://i.ibb.co/pzMk1pf/2253542a88b4.png',
    hasUnreadMessage: false,
    messageForWho: [],
    createdAt: Number(Date.now()),
    updatedAt: Number(Date.now()),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    authService = moduleRef.get(AuthService);
    userService = moduleRef.get(UsersService);
  });

  describe('createUser', () => {
    it('should create user', async () => {
      const payload = await authService.signup(testUser);
      user = payload[0];
      tokens = payload[1];

      expect(user.login).toBe(testUser.login);
      expect(typeof user.password === 'string').toBe(true);
      expect(user.version).toBe(testUser.version);
      expect(user.online).toBe(testUser.online);
      expect(user.avatar).toBe(testUser.avatar);

      expect(Object.keys(tokens).sort()).toEqual(
        ['accessToken', 'refreshToken'].sort(),
      );
    });
  });

  describe('updateUser', () => {
    it('should update user login', async () => {
      updatedUser = await userService.changeUserLogin(user.id, newLogin);
      expect(updatedUser.login === newLogin).toBe(true);
    });
  });

  describe('updateUser', () => {
    it('should update user password', async () => {
      const test: UpdateUserPasswordDto = {
        userId: user.id,
        newPassword: '7788',
        oldPassword: '123',
      };

      updatedUser = await userService.changeUserPassword(test);
      const isTrue = await compare(test.newPassword, updatedUser.password);
      expect(isTrue).toBe(true);
    });
  });

  describe('deleteUser', () => {
    it('should delete user', async () => {
      await authService.delete(updatedUser.id);
      await expect(
        userService.findOneById(updatedUser.id),
      ).rejects.toThrowError(NotFoundException);
    });
  });
});
