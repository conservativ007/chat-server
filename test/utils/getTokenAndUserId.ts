import { CONSTANTS } from './test.constants';

// const createUserDto = {
//   login: 'TEST_USER',
//   password: '123',
// };

export const getTokenAndUserId = async (request, createUserDto) => {
  // create user
  const { body } = await request
    .post(CONSTANTS.SIGNUP)
    .set('Accept', 'application/json')
    .send(createUserDto);

  const user = body[0];
  const tokens = body[1];

  const token = `Bearer ${tokens.accessToken}`;

  return { user, token };
};
