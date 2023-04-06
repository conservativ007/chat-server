import { IsString } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'login must be a string' })
  login: string;

  @IsString({ message: 'password must be a string' })
  password: string;
}
