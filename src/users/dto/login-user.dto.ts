import { IsString } from 'class-validator';

export class LoginUserDto {
  @IsString({ message: 'login must be a string' })
  login: string;

  @IsString({ message: 'password must be a string' })
  password: string;

  @IsString()
  socketID: string;
}
