interface IEmits {
  UPDATE_MESSAGE_FOR_ONE_USER: string;
  UPDATE_MESSAGE_FOR_GENERAL_CHAT: string;
  UPDATE_MESSAGE: string;
  DELETE_MESSAGE_FOR_ONE_USER: string;
  DELETE_MESSAGE_FOR_GENERAL_CHAT: string;
}

export const EMITS: IEmits = {
  UPDATE_MESSAGE_FOR_ONE_USER: 'update-message-for-one-user',
  UPDATE_MESSAGE_FOR_GENERAL_CHAT: 'update-message-for-general-chat',
  UPDATE_MESSAGE: 'update-message',
  DELETE_MESSAGE_FOR_ONE_USER: 'delete-message-for-one-user',
  DELETE_MESSAGE_FOR_GENERAL_CHAT: 'delete-message-for-general-chat',
};
