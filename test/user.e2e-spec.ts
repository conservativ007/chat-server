import { request } from './lib/index';

import { CONSTANTS } from './utils/test.constants';
import { UserEntity } from 'src/users/entities/user.entity';
import { UpdateUserPasswordDto } from 'src/users/dto/update-user-password.dto';
import { compare } from 'bcrypt';
import { getTokenAndUserId } from './utils/getTokenAndUserId';
import { removeUser } from './utils/removeUser';

describe('User (e2e)', () => {
  const createUserDto = {
    login: 'TEST_USER_TWO',
    password: '123',
  };
  let user: UserEntity;
  const unauthorizedRequest = request;

  const commonHeaders = { Accept: 'application/json' };

  beforeAll(async () => {
    const result = await getTokenAndUserId(request, createUserDto);
    commonHeaders['Authorization'] = result.token;
    user = result.user;
  });

  afterAll(async () => {
    await removeUser(request, user.id, commonHeaders);
  });

  describe('GET', () => {
    it('should return correct user', async () => {
      const response = await unauthorizedRequest
        .get(`${CONSTANTS.GET_ONE_USER}/${user.id}`)
        .set(commonHeaders);

      const foundUser: UserEntity = response.body;

      expect(response.status).toBe(200);
      expect(foundUser.id).toBe(user.id);
      expect(foundUser.login).toBe(user.login);
      expect(foundUser.version).toBe(1);
    });
  });

  describe('POST', () => {
    it('should change the username', async () => {
      const response = await unauthorizedRequest
        .post(CONSTANTS.URL_CHANGE_USERNAME)
        .set(commonHeaders)
        .send({ userId: user.id, newLogin: 'new_test_login' });

      const responseUser: UserEntity = response.body;

      expect(response.status).toBe(200);
      expect(responseUser.login).toBe('new_test_login');
      expect(responseUser.version).toBe(2);
    });

    it('should change the userpassword', async () => {
      const changePassword: UpdateUserPasswordDto = {
        userId: user.id,
        newPassword: '7788',
        oldPassword: '123',
      };

      const response = await unauthorizedRequest
        .post(CONSTANTS.URL_CHANGE_USERPASSWORD)
        .set(commonHeaders)
        .send(changePassword);

      const responseUser: UserEntity = response.body;

      const isPasswordChanged = await compare(
        changePassword.newPassword,
        responseUser.password,
      );

      expect(response.status).toBe(200);
      expect(responseUser.version).toBe(3);
      expect(isPasswordChanged).toBe(true);
    });

    it('should delete the user', async () => {
      const response = await unauthorizedRequest
        .delete(`${CONSTANTS.DELETE}/${user.id}`)
        .set(commonHeaders);
      expect(response.status).toBe(204);
    });
  });

  describe('GET, try to get user when the user was deleted', () => {
    it('should return status code 404', async () => {
      const response = await unauthorizedRequest
        .get(`${CONSTANTS.GET_ONE_USER}/${user.id}`)
        .set(commonHeaders);

      expect(response.status).toBe(404);
    });
  });
});
