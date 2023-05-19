import { IsString } from 'class-validator';

export class DeletePrivateMessageDto {
  @IsString()
  recieverId: string;

  @IsString()
  messageId: string;
}
