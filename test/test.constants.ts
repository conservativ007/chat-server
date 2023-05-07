import { UserEntity } from 'src/users/entities/user.entity';

interface IConstants {
  SIGNUP: string;
  LOGIN: string;
  ATTACH_SOKETID: string;
  LOGOUT_USER: string;
  URL_CHANGE_USERNAME: string;
  URL_CHANGE_USERPASSWORD: string;
  DELETE: string;
}

export const CONSTANTS: IConstants = {
  SIGNUP: '/auth/signup',
  LOGIN: '/auth/login',
  ATTACH_SOKETID: '/auth/attachsocket',
  LOGOUT_USER: '/auth/logout',
  URL_CHANGE_USERNAME: '/users/change-username',
  URL_CHANGE_USERPASSWORD: '/users/change-userpassword',
  DELETE: '/auth/delete',
};

export const testUser: Omit<UserEntity, 'id'> = {
  login: 'test-login',
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
