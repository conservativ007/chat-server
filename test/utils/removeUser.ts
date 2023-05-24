import { CONSTANTS } from './test.constants';

export const removeUser = async (request, userId: string, commonHeaders) => {
  await request.delete(`${CONSTANTS.DELETE}/${userId}`).set(commonHeaders);
};
