import { IsString } from 'class-validator';

export class SetLikeForMessageDto {
  @IsString()
  messageId: string;

  @IsString()
  userName: string;

  @IsString()
  action: string;
}
