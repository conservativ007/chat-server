import { IsString } from 'class-validator';

export class UpdateUserLoginDto {
  @IsString()
  userId: string;

  @IsString()
  newLogin: string;
}
