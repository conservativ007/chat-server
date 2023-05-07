import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

import { CONSTANTS, testUser } from './test.constants';
import { UserEntity } from 'src/users/entities/user.entity';
import { Tokens } from 'src/auth/types';
import { UpdateUserPasswordDto } from 'src/users/dto/update-user-password.dto';
import { compare } from 'bcrypt';
import { UpdateUserLoginDto } from 'src/users/dto/update-user-login.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let user: UserEntity;
  let tokens: Tokens;
  let accessToken: string;

  const commonHeaders = { Accept: 'application/json' };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET) should return string "Hello World!"', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it(`${CONSTANTS.SIGNUP} (POST) should create user`, async () => {
    const response: request.Response = await request(app.getHttpServer())
      .post(CONSTANTS.SIGNUP)
      .send(testUser);

    const data = response.body;
    const { status } = response;

    user = data[0];
    tokens = data[1];
    accessToken = `Bearer ${tokens.accessToken}`;
    commonHeaders['Authorization'] = accessToken;

    expect(status).toBe(201);
    expect(typeof user.id).toBe('string');
    expect(user.login === testUser.login).toBe(true);
    expect(user.version).toBe(1);
    expect(user.online).toBe(true);
  });

  it(`${CONSTANTS.URL_CHANGE_USERNAME} (POST) should change user name`, async () => {
    let updateUserLogin: UpdateUserLoginDto = {
      userId: user.id,
      newLogin: 'andrey',
    };

    return request(app.getHttpServer())
      .post(CONSTANTS.URL_CHANGE_USERNAME)
      .set(commonHeaders)
      .send(updateUserLogin)
      .expect((response: request.Response) => {
        const user: UserEntity = response.body;
        const { status } = response;

        expect(user.login).toBe('andrey');
        expect(user.version).toBe(2);
        expect(status).toBe(200);
      });
  });

  it(`${CONSTANTS.URL_CHANGE_USERPASSWORD} (POST) should change user password`, async () => {
    const changePassword: UpdateUserPasswordDto = {
      userId: user.id,
      newPassword: '7788',
      oldPassword: '123',
    };

    return await request(app.getHttpServer())
      .post(CONSTANTS.URL_CHANGE_USERPASSWORD)
      .set(commonHeaders)
      .send(changePassword)
      .expect(async (response: request.Response) => {
        const user: UserEntity = response.body;
        const { status } = response;

        expect(status).toBe(200);
        expect(user.version).toBe(3);
        const isPasswordChanged = await compare(
          changePassword.newPassword,
          user.password,
        );
        expect(isPasswordChanged).toBe(true);
      });
  });

  it(`${CONSTANTS.DELETE} (DELETE) should delete user`, async () => {
    const response: request.Response = await request(app.getHttpServer())
      .delete(`${CONSTANTS.DELETE}/${user.id}`)
      .set(commonHeaders);

    expect(response.status).toBe(204);
  });

  it(`${CONSTANTS.URL_CHANGE_USERNAME} (POST) should be a status 404`, async () => {
    let updateUserLogin: UpdateUserLoginDto = {
      userId: user.id,
      newLogin: 'andrey',
    };
    return await request(app.getHttpServer())
      .post(CONSTANTS.URL_CHANGE_USERNAME)
      .set(commonHeaders)
      .send(updateUserLogin)
      .expect((response: request.Response) => {
        const { status } = response;
        expect(status).toBe(404);
      });
  });
});
