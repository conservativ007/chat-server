import { UserEntity } from 'src/users/entities/user.entity';
import request from './lib/request';
import { getTokenAndUserId } from './utils/getTokenAndUserId';
import { removeUser } from './utils/removeUser';
import { CONSTANTS, ILike, IPreMessage } from './utils/test.constants';
import { MessageEntity } from 'src/websocket/messages/entities/message.entity';

describe('Message e2e', () => {
  const createUserDto = {
    login: 'TEST_USER',
    password: '123',
  };

  let user: UserEntity;
  let message: MessageEntity;
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

  it('/create-message-for-general-chat (POST) should return created message', async () => {
    const messageForGeneralChat: IPreMessage = {
      message: 'hello everybody!',
      senderName: user.login,
      receiverName: 'all',
    };

    const response = await unauthorizedRequest
      .post(CONSTANTS.CREATE_MESSAGE_FOR_GENERAL_CHAT)
      .set(commonHeaders)
      .send(messageForGeneralChat);

    message = response.body;

    expect(message.message).toBe(messageForGeneralChat.message);
    expect(message.senderName).toBe(messageForGeneralChat.senderName);
    expect(message.receiverName).toBe(messageForGeneralChat.receiverName);
    expect(message.likeCount).toBe(0);
    expect(Array.isArray(message.whoLiked)).toBe(true);
    expect(message.whoLiked).toHaveLength(0);
    expect(response.statusCode).toBe(201);
  });

  it(`${CONSTANTS.LIKE_MESSAGE} (POST) should like a message`, async () => {
    const likeDto: ILike = {
      action: 'public',
      messageId: message.id,
      senderName: user.login,
    };

    const response = await unauthorizedRequest
      .post(CONSTANTS.LIKE_MESSAGE)
      .set(commonHeaders)
      .send(likeDto);

    const responseMessage: MessageEntity = response.body;

    expect(responseMessage.likeCount).toBe(1);
    expect(Array.isArray(responseMessage.whoLiked)).toBe(true);
    expect(responseMessage.whoLiked.includes(likeDto.senderName));
    expect(responseMessage.whoLiked).toHaveLength(1);
    expect(response.statusCode).toBe(201);
  });

  it(`${CONSTANTS.LIKE_MESSAGE} (POST) should dislike a message`, async () => {
    const likeDto: ILike = {
      action: 'public',
      messageId: message.id,
      senderName: user.login,
    };

    const response = await unauthorizedRequest
      .post(CONSTANTS.LIKE_MESSAGE)
      .set(commonHeaders)
      .send(likeDto);

    const responseMessage: MessageEntity = response.body;

    expect(responseMessage.likeCount).toBe(0);
    expect(Array.isArray(responseMessage.whoLiked)).toBe(true);
    expect(responseMessage.whoLiked).toHaveLength(0);
    expect(response.statusCode).toBe(201);
  });

  it(`${CONSTANTS.GENERAL_CHAT_MESSAGE_EDIT} (POST) should change a message`, async () => {
    const updatedMessage: MessageEntity = {
      ...message,
      message: 'new text a message',
    };

    const response = await unauthorizedRequest
      .post(CONSTANTS.GENERAL_CHAT_MESSAGE_EDIT)
      .set(commonHeaders)
      .send(updatedMessage);

    const responseMessage: MessageEntity = response.body;

    expect(responseMessage.message).toBe(updatedMessage.message);
    expect(responseMessage.senderName).toBe(message.senderName);
    expect(responseMessage.receiverName).toBe(message.receiverName);
    expect(responseMessage.likeCount).toBe(0);
    expect(Array.isArray(responseMessage.whoLiked)).toBe(true);
    expect(responseMessage.whoLiked).toHaveLength(0);
    expect(response.statusCode).toBe(201);
  });

  it(`${CONSTANTS.GENERAL_CHAT_MESSAGE_DELETE}/UUID (POST) should delete a message`, async () => {
    const response = await unauthorizedRequest
      .delete(`${CONSTANTS.GENERAL_CHAT_MESSAGE_DELETE}/${message.id}`)
      .set(commonHeaders);

    expect(response.statusCode).toBe(204);
  });

  it(`${CONSTANTS.FIND_ONE_MESSAGE_IN_GENERAL_CHAT}/UUID (GET) should return a status code 404`, async () => {
    const response = await unauthorizedRequest
      .delete(`${CONSTANTS.FIND_ONE_MESSAGE_IN_GENERAL_CHAT}/${message.id}`)
      .set(commonHeaders);
    expect(response.statusCode).toBe(404);
  });
});
