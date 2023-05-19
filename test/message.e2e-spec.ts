import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

import {
  CONSTANTS,
  testUserTwo,
  defaultPreMessage,
  defaultLikeMessage,
  ILike,
} from './test.constants';
import { UserEntity } from 'src/users/entities/user.entity';
import { Tokens } from 'src/auth/types';
import { UpdateUserPasswordDto } from 'src/users/dto/update-user-password.dto';
import { compare } from 'bcrypt';
import { UpdateUserLoginDto } from 'src/users/dto/update-user-login.dto';
import { MessageEntity } from 'src/websocket/messages/entities/message.entity';
import exp from 'constants';

describe('MessageController (e2e)', () => {
  let app: INestApplication;
  let user: UserEntity;
  let tokens: Tokens;
  let accessToken: string;
  let testMessage: MessageEntity;

  const commonHeaders = { Accept: 'application/json' };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it(`${CONSTANTS.SIGNUP} (POST) should create user`, async () => {
    const response: request.Response = await request(app.getHttpServer())
      .post(CONSTANTS.SIGNUP)
      .send(testUserTwo);

    const data = response.body;
    const { status } = response;

    user = data[0];
    tokens = data[1];
    accessToken = `Bearer ${tokens.accessToken}`;
    commonHeaders['Authorization'] = accessToken;

    expect(status).toBe(201);
    expect(typeof user.id).toBe('string');
    expect(user.login === testUserTwo.login).toBe(true);
    expect(user.version).toBe(1);
    expect(user.online).toBe(true);
  });

  it('/create-message-for-general-chat (POST) should return created message', async () => {
    const response: request.Response = await request(app.getHttpServer())
      .post(CONSTANTS.CREATE_MESSAGE_FOR_GENERAL_CHAT)
      .set(commonHeaders)
      .send(defaultPreMessage);

    testMessage = response.body;
    const { status } = response;

    expect(testMessage.message).toBe(defaultPreMessage.message);
    expect(testMessage.senderName).toBe(defaultPreMessage.senderName);
    expect(testMessage.receiverName).toBe(defaultPreMessage.receiverName);
    expect(testMessage.likeCount).toBe(0);
    expect(Array.isArray(testMessage.whoLiked)).toBe(true);
    expect(testMessage.whoLiked).toHaveLength(0);
    expect(status).toBe(201);
  });

  it(`${CONSTANTS.LIKE_MESSAGE} (POST) should like a message`, async () => {
    const likeDto: ILike = {
      action: 'public',
      messageId: testMessage.id,
      senderName: user.login,
    };

    const response: request.Response = await request(app.getHttpServer())
      .post(CONSTANTS.LIKE_MESSAGE)
      .set(commonHeaders)
      .send(likeDto);

    const message: MessageEntity = response.body;
    const { status } = response;

    expect(message.message).toBe(defaultPreMessage.message);
    expect(message.senderName).toBe(defaultPreMessage.senderName);
    expect(message.receiverName).toBe(defaultPreMessage.receiverName);
    expect(message.likeCount).toBe(1);
    expect(Array.isArray(message.whoLiked)).toBe(true);
    expect(message.whoLiked.includes(likeDto.senderName));
    expect(message.whoLiked).toHaveLength(1);
    expect(status).toBe(201);
  });

  it(`${CONSTANTS.LIKE_MESSAGE} (POST) should dislike a message`, async () => {
    const likeDto: ILike = {
      action: 'public',
      messageId: testMessage.id,
      senderName: user.login,
    };

    const response: request.Response = await request(app.getHttpServer())
      .post(CONSTANTS.LIKE_MESSAGE)
      .set(commonHeaders)
      .send(likeDto);

    const message: MessageEntity = response.body;
    const { status } = response;

    expect(message.message).toBe(defaultPreMessage.message);
    expect(message.senderName).toBe(defaultPreMessage.senderName);
    expect(message.receiverName).toBe(defaultPreMessage.receiverName);
    expect(message.likeCount).toBe(0);
    expect(Array.isArray(message.whoLiked)).toBe(true);
    expect(message.whoLiked).toHaveLength(0);
    expect(status).toBe(201);
  });

  it(`${CONSTANTS.GENERAL_CHAT_MESSAGE_EDIT} (POST) should change a message`, async () => {
    const updatedMessage: MessageEntity = {
      ...testMessage,
      message: 'new text a message',
    };

    const response: request.Response = await request(app.getHttpServer())
      .post(CONSTANTS.GENERAL_CHAT_MESSAGE_EDIT)
      .set(commonHeaders)
      .send(updatedMessage);

    const message: MessageEntity = response.body;
    const { status } = response;

    expect(message.message).toBe(updatedMessage.message);
    expect(message.senderName).toBe(defaultPreMessage.senderName);
    expect(message.receiverName).toBe(defaultPreMessage.receiverName);
    expect(message.likeCount).toBe(0);
    expect(Array.isArray(message.whoLiked)).toBe(true);
    expect(message.whoLiked).toHaveLength(0);
    expect(status).toBe(201);
  });

  it(`${CONSTANTS.GENERAL_CHAT_MESSAGE_DELETE}/UUID (POST) should delete a message`, async () => {
    const response: request.Response = await request(app.getHttpServer())
      .delete(`${CONSTANTS.GENERAL_CHAT_MESSAGE_DELETE}/${testMessage.id}`)
      .set(commonHeaders);
    const { status } = response;
    expect(status).toBe(204);
  });

  it(`${CONSTANTS.FIND_ONE_MESSAGE_IN_GENERAL_CHAT}/UUID (GET) should return a status code 404`, async () => {
    const response: request.Response = await request(app.getHttpServer())
      .delete(`${CONSTANTS.FIND_ONE_MESSAGE_IN_GENERAL_CHAT}/${testMessage.id}`)
      .set(commonHeaders);
    const { status } = response;
    expect(status).toBe(404);
  });

  it(`${CONSTANTS.DELETE} (DELETE) should delete user`, async () => {
    const response: request.Response = await request(app.getHttpServer())
      .delete(`${CONSTANTS.DELETE}/${user.id}`)
      .set(commonHeaders);

    expect(response.status).toBe(204);
  });
});
