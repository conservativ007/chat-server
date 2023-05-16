interface IEmits {
  UPDATE_MESSAGE_FOR_ONE_USER: string;
  UPDATE_MESSAGE_FOR_GENERAL_CHAT: string;
  UPDATE_MESSAGE: string;
  DELETE_MESSAGE_FOR_ONE_USER: string;
  DELETE_MESSAGE_FOR_GENERAL_CHAT: string;
  SET_LIKE_TO_MESSAGE: string;
  GET_ALL_USERS: string;
  GET_MESSAGES_FOR_GENERAL_CHAT: string;
  GET_MESSAGES_FOR_PRIVATE_CHAT: string;
  REMOVE_NAME_FOR_MESSAGE_TO: string;
  CREATE_PRIVATE_MESSAGE: string;
  CREATE_MESSAGE_FOR_GENERAL_CHAT: string;
}

export const EMITS: IEmits = {
  UPDATE_MESSAGE_FOR_ONE_USER: 'update-message-for-one-user',
  UPDATE_MESSAGE_FOR_GENERAL_CHAT: 'update-message-for-general-chat',
  UPDATE_MESSAGE: 'update-message',
  DELETE_MESSAGE_FOR_ONE_USER: 'delete-message-for-one-user',
  DELETE_MESSAGE_FOR_GENERAL_CHAT: 'delete-message-for-general-chat',
  SET_LIKE_TO_MESSAGE: 'set-like-to-message',
  GET_ALL_USERS: 'get-all-users',
  GET_MESSAGES_FOR_GENERAL_CHAT: 'get-messages-for-general-chat',
  GET_MESSAGES_FOR_PRIVATE_CHAT: 'get-messages-for-private-chat',
  REMOVE_NAME_FOR_MESSAGE_TO: 'remove-name-for-message-to',
  CREATE_PRIVATE_MESSAGE: 'create-private-message',
  CREATE_MESSAGE_FOR_GENERAL_CHAT: 'create-message-for-general-chat',
};
