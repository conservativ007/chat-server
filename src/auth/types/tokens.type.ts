export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export type UserPayload = {
  login: string;
  userId: string;
  iat: number;
  exp: number;
};
