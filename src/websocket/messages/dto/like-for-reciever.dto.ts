import { IsString } from 'class-validator';

export class LikeForMessageForRecieverDto {
  @IsString()
  messageId: string;

  @IsString()
  senderName: string;

  @IsString()
  recieverId: string;
}
