import { IsString } from 'class-validator';

export class SetUserAvatarDTO {
  @IsString()
  userId: string;

  @IsString()
  avatar: string;
}
