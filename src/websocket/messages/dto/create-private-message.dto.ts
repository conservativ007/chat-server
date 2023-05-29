import { IsString } from 'class-validator';

export class CreatePrivateMessageDto {
  @IsString()
  senderName: string;

  @IsString()
  receiverName: string;

  @IsString()
  senderId: string;

  @IsString()
  receiverId: string;

  @IsString()
  message: string;
}
