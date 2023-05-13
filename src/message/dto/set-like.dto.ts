import { IsString } from 'class-validator';

export class SetLikeForMessageDto {
  @IsString()
  messageId: string;

  @IsString()
  senderName: string;

  @IsString()
  action: string;
}
