import { UserEntity } from 'src/users/entities/user.entity';

interface IConstants {
  SIGNUP: string;
  LOGIN: string;
  ATTACH_SOKETID: string;
  LOGOUT_USER: string;
  URL_CHANGE_USERNAME: string;
  URL_CHANGE_USERPASSWORD: string;
  DELETE: string;
  GET_ONE_USER: string;
  CREATE_MESSAGE_FOR_GENERAL_CHAT: string;
  GENERAL_CHAT_MESSAGE_EDIT: string;
  LIKE_MESSAGE: string;
  GENERAL_CHAT_MESSAGE_DELETE: string;
  FIND_ONE_MESSAGE_IN_GENERAL_CHAT: string;
}

export const CONSTANTS: IConstants = {
  SIGNUP: '/auth/signup',
  LOGIN: '/auth/login',
  ATTACH_SOKETID: '/auth/attachsocket',
  LOGOUT_USER: '/auth/logout',
  URL_CHANGE_USERNAME: '/users/change-username',
  URL_CHANGE_USERPASSWORD: '/users/change-userpassword',
  DELETE: '/auth/delete',
  GET_ONE_USER: '/users',
  CREATE_MESSAGE_FOR_GENERAL_CHAT: '/message/create-message-for-general-chat',
  LIKE_MESSAGE: '/message/message-like',
  GENERAL_CHAT_MESSAGE_EDIT: '/message/general-chat-message-edit',
  GENERAL_CHAT_MESSAGE_DELETE: '/message/general-chat-message-delete',
  FIND_ONE_MESSAGE_IN_GENERAL_CHAT: '/message/find-one-message-general-chat',
};

export const testUser: Omit<UserEntity, 'id'> = {
  login: 'test-user',
  password: '123',
  version: 1,
  online: true,
  socketID: null,
  hashedRt: null,
  targetForMessage: null,
  avatar: 'https://i.ibb.co/pzMk1pf/2253542a88b4.png',
  messageForWho: [],
  createdAt: Number(Date.now()),
  updatedAt: Number(Date.now()),
};

export const testUserTwo: Omit<UserEntity, 'id'> = {
  login: 'test-user-two',
  password: '7788',
  version: 1,
  online: true,
  socketID: null,
  hashedRt: null,
  targetForMessage: null,
  avatar: 'https://i.ibb.co/pzMk1pf/2253542a88b4.png',
  messageForWho: [],
  createdAt: Number(Date.now()),
  updatedAt: Number(Date.now()),
};

export interface IPreMessage {
  message: string;
  senderName: string;
  receiverName: string;
}

export const defaultPreMessage: IPreMessage = {
  message: 'test message',
  senderName: 'xxx',
  receiverName: 'mister',
};

export interface ILike {
  messageId: string;
  senderName: string;
  action: 'public' | 'private';
}

export const defaultLikeMessage: ILike = {
  messageId: '',
  senderName: '',
  action: 'public',
};
