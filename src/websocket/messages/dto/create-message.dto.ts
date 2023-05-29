import { IsString } from 'class-validator';

export class CreateMessageDto {
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
